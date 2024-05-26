import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SoapXML() {
    const [movies, setMovies] = useState([]);
    const [moviesXML, setMoviesXML] = useState([]);
    const [newMovie, setNewMovie] = useState({
        title: '',
        director: '',
        year: '',
        coverImage: ''
    });
    const [editingMovieId, setEditingMovieId] = useState(null);
    const [editingMovie, setEditingMovie] = useState({
        id: null,
        title: '',
        director: '',
        year: '',
        coverImage: ''
    });

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = () => {
        fetch('http://localhost:3001/xml/movies')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                return response.text();
            })
            .then(str => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(str, "application/xml");
                const moviesArray = Array.from(xmlDoc.getElementsByTagName("movie")).map(movie => ({
                    id: movie.getElementsByTagName("id")[0].textContent,
                    title: movie.getElementsByTagName("title")[0].textContent,
                    director: movie.getElementsByTagName("director")[0].textContent,
                    year: movie.getElementsByTagName("year")[0].textContent,
                    coverImage: movie.getElementsByTagName("coverImage")[0].textContent,
                }));
                setMovies(moviesArray);
                setMoviesXML(str);
            })
            .catch(error => console.error('Error fetching movies:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingMovieId !== null) {
            setEditingMovie({ ...editingMovie, [name]: value });
        } else {
            setNewMovie({ ...newMovie, [name]: value });
        }
    };

    const handleAddMovie = () => {
        const movieXml = `
            <movie>
                <title>${newMovie.title}</title>
                <director>${newMovie.director}</director>
                <year>${newMovie.year}</year>
                <coverImage>${newMovie.coverImage}</coverImage>
            </movie>
        `;
        fetch('http://localhost:3001/xml/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml'
            },
            body: movieXml
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add movie');
                }
                return response.text();
            })
            .then(() => {
                fetchMovies();
                setNewMovie({
                    title: '',
                    director: '',
                    year: '',
                    coverImage: ''
                });
            })
            .catch(error => console.error('Error adding movie:', error));
    };

    const handleEditMovie = () => {
        const movieXml = `
            <movie>
                <id>${editingMovie.id}</id>
                <title>${editingMovie.title}</title>
                <director>${editingMovie.director}</director>
                <year>${editingMovie.year}</year>
                <coverImage>${editingMovie.coverImage}</coverImage>
            </movie>
        `;
        fetch(`http://localhost:3001/xml/movies/${editingMovie.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/xml'
            },
            body: movieXml
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to edit movie');
                }
                return response.text();
            })
            .then(() => {
                fetchMovies();
                setEditingMovieId(null);
                setEditingMovie({
                    id: null,
                    title: '',
                    director: '',
                    year: '',
                    coverImage: ''
                });
            })
            .catch(error => console.error('Error editing movie:', error));
    };

    const handleDeleteMovie = (id) => {
        fetch(`http://localhost:3001/xml/movies/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete movie');
                }
                return response.text();
            })
            .then(() => {
                fetchMovies();
            })
            .catch(error => console.error('Error deleting movie:', error));
    };

    const handleStartEditing = (movie) => {
        setEditingMovieId(movie.id);
        setEditingMovie(movie);
    };

    return (
        <div>
            <h1>Películas (XML)</h1>
            <pre>{moviesXML}</pre>
            <h2>Agregar Nueva Película</h2>
            <input type="text" name="title" placeholder="Título" value={newMovie.title} onChange={handleInputChange} />
            <input type="text" name="director" placeholder="Director" value={newMovie.director} onChange={handleInputChange} />
            <input type="text" name="year" placeholder="Año" value={newMovie.year} onChange={handleInputChange} />
            <input type="text" name="coverImage" placeholder="URL de la imagen de portada" value={newMovie.coverImage} onChange={handleInputChange} />
            <button onClick={handleAddMovie}>Agregar Película</button>

            <h2>Películas Existentes</h2>
            {movies.length > 0 ? (
                <ul>
                    {movies.map(movie => (
                        <li key={movie.id}>
                            {editingMovieId === movie.id ? (
                                <div>
                                    <h3>{movie.title}</h3>
                                    <input type="text" name="title" value={editingMovie.title} onChange={handleInputChange} />
                                    <input type="text" name="director" value={editingMovie.director} onChange={handleInputChange} />
                                    <input type="text" name="year" value={editingMovie.year} onChange={handleInputChange} />
                                    <input type="text" name="coverImage" value={editingMovie.coverImage} onChange={handleInputChange} />
                                    <button onClick={handleEditMovie}>Guardar Cambios</button>
                                </div>
                            ) : (
                                <div>
                                    <h3>{movie.title}</h3>
                                    <p><strong>Director:</strong> {movie.director}</p>
                                    <p><strong>Año:</strong> {movie.year}</p>
                                    <img src={movie.coverImage} alt={movie.title} style={{ maxWidth: '200px' }} />
                                    <button className="delete" onClick={() => handleDeleteMovie(movie.id)}>Eliminar</button>
                                    <button className="edit" onClick={() => handleStartEditing(movie)}>Editar</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay películas disponibles.</p>
            )}
            <div className="button-container">
                <Link to="/">
                    <button className="styled-button">Inicio</button>
                </Link>
            </div>
        </div>
    );
}

export default SoapXML;
