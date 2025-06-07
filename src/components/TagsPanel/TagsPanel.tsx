import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { useAtom } from 'jotai';
import { tagsAtom, selectedTagsAtom, createTag } from '../../store/atoms';
import { Tag } from '../../types';
import './TagsPanel.css';

export const TagsPanel: React.FC = () => {
  const [tags, setTags] = useAtom(tagsAtom);
  const [selectedTags, setSelectedTags] = useAtom(selectedTagsAtom);
  const [newTagName, setNewTagName] = useState('');
  
  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    
    const newTag = createTag(newTagName);
    setTags([...tags, newTag]);
    setNewTagName('');
  };
  
  const toggleTagSelection = (tag: Tag) => {
    if (selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  return (
    <div className="tags-panel">
      <div className="tags-header">
        <h2>Tagi</h2>
      </div>
      
      <div className="add-tag-form">
        <input 
          type="text" 
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="Nowy tag..."
          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
        />
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddTag}
        >
          <FaPlus />
        </motion.button>
      </div>
      
      <div className="tags-container">
        {tags.length === 0 ? (
          <p className="no-tags">Nie masz jeszcze żadnych tagów. Dodaj pierwszy!</p>
        ) : (
          tags.map(tag => (
            <motion.div
              key={tag.id}
              className={`tag-item ${selectedTags.some(t => t.id === tag.id) ? 'selected' : ''}`}
              style={{ backgroundColor: tag.color }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTagSelection(tag)}
            >
              {tag.name}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
