import React from 'react';
import { ArrowRightIcon, PlusCircle } from 'lucide-react';

function CategoryList({ categories, selectedCategory, onCategoryClick, onAddCategory }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full md:w-[200px] h-auto md:h-[360px]">
      <h2 className="text-base font-semibold mt-2">All Categories</h2>
      <ul className="mt-4">
        {categories.map(category => (
          <li
            key={category.id}
            className={`category flex items-center justify-between mb-2 ${category.id === selectedCategory ? 'text-yellow-500 selectedCategory' : ''}`}
            onClick={() => onCategoryClick(category.id)}
          >
            <span className="text-sm">{category.name}</span>
            <ArrowRightIcon className="w-4 h-4 cursor-pointer" />
          </li>
        ))}
      </ul>
      <div className="flex mt-5">
        <div
          className="hover:text-green-700 flex items-center mt-1 rounded-md px-3 py-1 cursor-pointer"
          onClick={onAddCategory}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          <p className="text-sm">Add Category</p>
        </div>
      </div>
    </div>
  );
}

export default CategoryList;
