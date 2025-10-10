import React, { useState } from 'react';

interface AnimeData {
  title: string;
  description: string;
  rating: string;
  author: string;
  startedAiring: string;
  finishedAiring: string;
  status: 'ONGOING' | 'FINISHED' | 'CANCELLED';
  thumbnailUrl: string;
}

const AddAnimeForm: React.FC = () => {
  const [animeData, setAnimeData] = useState<AnimeData>({
    title: '',
    description: '',
    rating: '',
    author: '',
    startedAiring: '',
    finishedAiring: '',
    status: 'ONGOING', // Default status
    thumbnailUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAnimeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert rating to a number for the backend, if it exists
    const { rating, ...restOfData } = animeData;
    const formattedData = {
      ...restOfData,
      rating: rating ? parseFloat(rating) : null, // Handle empty rating
    };

    try {
      const response = await fetch('http://localhost:3000/anime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        alert('Anime added successfully!');
        setAnimeData({
          title: '',
          description: '',
          rating: '',
          author: '',
          startedAiring: '',
          finishedAiring: '',
          status: 'ONGOING',
          thumbnailUrl: '',
        });
      } else {
        alert('Failed to add anime');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding anime');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Add New Anime</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={animeData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            value={animeData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (0-10)</label>
          <input
            type="number"
            name="rating"
            id="rating"
            value={animeData.rating}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="10"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            name="author"
            id="author"
            value={animeData.author}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="startedAiring" className="block text-sm font-medium text-gray-700">Started Airing</label>
          <input
            type="datetime-local"
            name="startedAiring"
            id="startedAiring"
            value={animeData.startedAiring}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="finishedAiring" className="block text-sm font-medium text-gray-700">Finished Airing</label>
          <input
            type="datetime-local"
            name="finishedAiring"
            id="finishedAiring"
            value={animeData.finishedAiring}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            id="status"
            value={animeData.status}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          >
            <option value="ONGOING">Ongoing</option>
            <option value="FINISHED">Finished</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
          <input
            type="text"
            name="thumbnailUrl"
            id="thumbnailUrl"
            value={animeData.thumbnailUrl}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Add Anime
        </button>
      </form>
    </div>
  );
};

export default AddAnimeForm;
