
const Filter = ({ categories, setSelectedCategories, selectedCategories }) => {

  const handleCategoryChange = (categoryId) => {
    const isSelected = selectedCategories.includes(categoryId);

    if (isSelected) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const renderCategory = (category) => (
    <div key={category.id}>
      <div className="flex gap-1 text-white">
        <input
          type="checkbox"
          value={category.id}
          checked={selectedCategories.includes(category.id)}
          onChange={() => handleCategoryChange(category.id)}
        />
       <p>{category.name}</p> 
      </div>

      {category?.subcategories && category?.subcategories.length > 0 && (
        <div className="ml-[20px]">
          {category?.subcategories?.map((subCategory) =>
            renderCategory(subCategory)
          )}
        </div>
      )}
    </div>
  );

  return <div>{categories.map((category) => renderCategory(category))}</div>;
};

export default Filter;
