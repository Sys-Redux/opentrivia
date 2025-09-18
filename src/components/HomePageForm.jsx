import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import axios from 'axios'

const HomePageForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        difficulty: '',
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const difficulties = ['easy', 'medium', 'hard'];
    const navigate = useNavigate();


    useEffect(() => {
        const categoryURL = 'https://opentdb.com/api_category.php';
        axios.get(categoryURL)
        .then(response => {
            setCategories(response.data.trivia_categories);
        })
        .catch(err => {
            console.error('Error fetching categories:', err);
            setError('Failed to fetch categories. Please try again later.');
        });
    }, []);

    // Single function to handle all form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        let apiURL = 'https://opentdb.com/api.php?amount=10';
        if (formData.category) {
            apiURL += `&category=${formData.category}`;
        }
        if (formData.difficulty) {
            apiURL += `&difficulty=${formData.difficulty}`;
        }
        navigate('/questions', {
            state: {
                apiURL: apiURL,
                username: formData.name
            }
        });
    };

    return (
        <div className='vh-100 d-flex justify-content-center align-items-center'>
            <Container className='bg-danger p-4 rounded d-flex flex-column align-items-center' style={{ maxWidth: '600px'}}>
                    <Form onSubmit={handleSubmit} className='w-100' style={{maxWidth: '600px'}}>
                        {error && <Alert variant='danger'>{error}</Alert>}

                        <h1 className='text-center mb-4'>Trevor's Trivia</h1>
                        <Row className='justify-content-center'>
                            <Col md='8'>
                                <Form.Label htmlFor='username'>Username:</Form.Label>
                                <InputGroup className='mb-3'>
                                    <InputGroup.Text id='username'>@</InputGroup.Text>
                                    <Form.Control
                                        type='text'
                                        id='username'
                                        name='name'
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder='Enter your username'
                                        aria-label='Username'
                                        required
                                    />
                                </InputGroup>
                            </Col>
                        </Row>

                        <Row className='justify-content-center'>
                            <Col md='8'>
                                <Form.Label htmlFor='category'>Category:</Form.Label>
                                <Form.Select
                                    id='category'
                                    name='category'
                                    value={formData.category}
                                    onChange={handleChange}
                                    className='mb-3'
                                >
                                    <option value=''>Any Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>

                        <Row className='justify-content-center'>
                            <Col md='8'>
                                <Form.Label htmlFor='difficulty'>Difficulty:</Form.Label>
                                <Form.Select
                                    id='difficulty'
                                    name='difficulty'
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    className='mb-3'
                                >
                                    <option value=''>Any Difficulty</option>
                                    {difficulties.map(level => (
                                        <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                        <div className='d-flex justify-content-center'>
                            <Button variant='dark' type='submit'>Get Questions</Button>
                        </div>
                    </Form>
            </Container>
        </div>
    );
};

export default HomePageForm;