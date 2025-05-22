import React, { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({ name: '', category: '', price: '', image: null });

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove, { id: foodId }`);
      if (response.data.success) {
        toast.success("Food removed successfully");
        await fetchList();
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      toast.error("An error occurred while removing food");
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item._id);
    setEditData({ name: item.name, category: item.category, price: item.price, image: null });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append('id', editingItem);
    formData.append('name', editData.name);
    formData.append('category', editData.category);
    formData.append('price', editData.price);
    if (editData.image) formData.append('image', editData.image);

    try {
      const response = await axios.post(`${url}/api/food/update`, formData);
      if (response.data.success) {
        toast.success("Item updated successfully");
        setEditingItem(null);
        fetchList();
      } else {
        toast.error("Error while updating item.");
      }
    } catch (error) {
      toast.error("An error occurred while updating.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Remove</b>
          <b>Edit</b>
        </div>

        {list.length > 0 ? (
          list.map((item, index) => (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/${item.image}`} alt={item.name} width="50" height="50" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <button className="remove-btn" onClick={() => removeFood(item._id)}>Remove</button>
              <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
            </div>
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>

      {editingItem && (
        <div className="edit-popup">
          <div className='edit-form'>
            <h3>Edit Food Item</h3>
            <input type='text' name='name' value={editData.name} onChange={handleEditChange} placeholder='Name' />
            <input type='text' name='category' value={editData.category} onChange={handleEditChange} placeholder='Category' />
            <input type='number' name='price' value={editData.price} onChange={handleEditChange} placeholder='Price' />
            <input type='file' name='image' accept='image/*' onChange={handleEditChange} />
            <button className='save-btn' onClick={handleEditSubmit}>Save</button>
            <button className='cancel-btn' onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
