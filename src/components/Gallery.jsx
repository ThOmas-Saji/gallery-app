import React, { useState, useEffect } from "react";
import { category, data } from "../data.js";
import useDebounce from "../hooks/useDebounce.js";
import Filter from "./Filter.jsx";
import Modal from "./Modal.jsx";
import { formatDate } from "../utils.js";

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [collection, setCollection] = useState(data);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [modalData, setModalData] = useState("");
  const [sortType, setSortType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sortMode, setSortMode] = useState(false);

  const debouncedValue = useDebounce(searchTerm, 600);

  const sortByCollectionNameAsc = (a, b) =>
    a.collectionName.localeCompare(b.collectionName);
  const sortByCreatedAt = (a, b) =>
    new Date(a.createdAt) - new Date(b.createdAt);

  const sortByCollectionNameDesc = (a, b) =>
    b.collectionName.localeCompare(a.collectionName);

  const handleSort = (sortBy) => {
    let sorted = [];
    if (sortBy?.trim()) {
      if (sortBy === "date") {
        sorted = [...collection].sort(sortByCreatedAt);
      }
      if (sortBy === "asc") {
        sorted = [...collection].sort(sortByCollectionNameAsc);
      }
      if (sortBy === "desc") {
        sorted = [...collection].sort(sortByCollectionNameDesc);
      }
      setCollection(sorted);
    }
  };

  const handleSearch = (search) => {
    // Filter the data based on the search term
    let filteredData = data?.filter((item) =>
      item?.collectionName?.toLowerCase()?.includes(search)
    );
    if (selectedCategories?.length) {
      filteredData = filteredData.filter((item) => {
        const isFind = selectedCategories?.find(
          (id) =>
            item?.categoryId === id ||
            item?.firstSubcategoryId === id ||
            item?.secondSubcategoryId === id
        );
        if (isFind) {
          return item;
        }
      });
    }
    setCollection(filteredData);
  };

  const handleFilter = () => {
    let filteredData = data.filter((item) => {
      const isFind = selectedCategories?.find(
        (id) =>
          item?.categoryId === id ||
          item?.firstSubcategoryId === id ||
          item?.secondSubcategoryId === id
      );
      if (isFind) {
        return item;
      }
    });

    if (searchTerm?.trim()) {
      filteredData = filteredData?.filter((item) =>
        item?.collectionName?.toLowerCase()?.includes(searchTerm)
      );
    }
    setCollection(filteredData);
  };

  useEffect(() => {
    handleSearch(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    handleSort(sortType);
  }, [sortType]);

  useEffect(() => {
    if (selectedCategories?.length) {
      handleFilter();
    } else {
      setSearchTerm("");
      setCollection(data);
    }
  }, [selectedCategories]);

  return (
    <div className="w-full flex gap-2">
      <div className="w-1/5 min-w-[100px] h-[80dvh] overflow-auto">
        <Filter
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          categories={category}
        />
      </div>
      <div className="w-4/5 flex justify-center gap-4 flex-wrap">
        <div className="w-full h-fit flex items-center justify-between gap-2 px-[40px] flex-wrap">
          <input
            placeholder="Search"
            className="max-w-[100%] border bg-transparent text-white rounded-lg text-lg p-2"
            onChange={(e) => setSearchTerm(e?.target?.value?.toLowerCase())}
            value={searchTerm}
            type="text"
          />{" "}
          <div className="">
            {sortMode ? (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSortType("asc")}
                  className="border border-white text-white px-4 py-1 rounded-lg"
                >
                  Sort By A-Z
                </button>
                <button
                  onClick={() => setSortType("desc")}
                  className="border border-white text-white px-4 py-1 rounded-lg"
                >
                  Sort By Z-A
                </button>
                <button
                  onClick={() => setSortType("date")}
                  className="border border-white text-white px-4 py-1 rounded-lg"
                >
                  Sort By Recently Added
                </button>
                <button
                  onClick={() => setSortMode(false)}
                  className="border border-white text-xl text-white px-4 py-1 rounded-lg"
                >
                  X
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSortMode(true)}
                className="border border-white text-white px-4 py-1 rounded-lg"
              >
                Sort
              </button>
            )}
          </div>
        </div>
        <div className="w-full flex justify-center gap-4 flex-wrap">
          {collection?.length ? (
            collection?.map((item) => {
              const categoryDetails = category.find(
                (catgry) => item?.categoryId === catgry?.id
              );
              return (
                <div
                  key={item?.collectionId}
                  className="flex flex-col gap-2 min-w-[200px] w-1/6 h-[300px] my-2"
                  onClick={() => {
                    setModalData({
                      ...item,
                      name: categoryDetails?.name,
                    });
                    setIsModalOpen(true);
                  }}
                >
                  <img
                    className="w-full h-[80%] object-cover"
                    src={item?.image}
                    alt={item?.collectionName}
                  />
                  <h2 className="text-sm font-semibold text-white">
                    {item?.collectionName}
                  </h2>
                  <p className="text-sm font-extralight text-white">
                    {categoryDetails?.name}
                  </p>
                </div>
              );
            })
          ) : (
            <h2 className="text-sm font-semibold text-white">No data found!</h2>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen}>
        <div className="p-4 min-w-[300px]">
          <div className="w-full flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="border border-white text-xl p-1 rounded-lg"
            >
              X
            </button>
          </div>
          <div className="flex flex-col gap-2 w-full h-[500px]">
            <img
              className="w-full h-[80%] object-contain"
              src={modalData?.image}
              alt={modalData?.collectionName}
            />
            <h2 className="text-sm font-semibold ">
              {modalData?.collectionName}
            </h2>
            <p className="text-sm font-extralight">{modalData?.name}</p>
            <p className="text-sm">
              {modalData?.createdAt ? formatDate(modalData?.createdAt) : ""}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Gallery;
