import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';

const TriviaQuestion = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [formError, setFormError] = useState('');
    const [score, setScore] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();

    // Get data from router state
    const { apiURL, username, currentScore = 0, startIndex = 0, questions: existingQuestions } = location.state || {};

    useEffect(() => {
        if (!apiURL || !username) {
            navigate('/');
            return;
        }

        setScore(currentScore);
        setCurrentQuestionIndex(startIndex);

        // Only fetch questions if we don't have them already
        if (existingQuestions && existingQuestions.length > 0) {
            setQuestions(existingQuestions);
            return;
        }

        setLoading(true);
        setError(null);
        setQuestions([]);

        axios.get(apiURL)
            .then(response => {
                if (response.data.response_code === 0) {
                    // Process questions to combine correct & incorrect answers
                    const processedQuestions = response.data.results.map(q => {
                        const allAnswers = [...q.incorrect_answers, q.correct_answer];
                        const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
                        return {
                            ...q,
                            allAnswers: shuffledAnswers
                        };
                    });
                    setQuestions(processedQuestions);
                } else {
                    setError('No questions found for the selected options. Please try different settings.');
                }
            })
            .catch(err => {
                console.error('Error fetching questions:', err);
                setError('Failed to fetch questions. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [apiURL, username, navigate]);

    const handleAnswerChange = (e) => {
        setSelectedAnswer(e.target.value);
        setFormError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedAnswer) {
            setFormError('Please select an answer before submitting.');
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.correct_answer;
        const newScore = isCorrect ? score + 1 : score;

        // Navigate to results page
        navigate('/results', {
            state: {
                username,
                isCorrect,
                correctAnswer: currentQuestion.correct_answer,
                userAnswer: selectedAnswer,
                questionNumber: currentQuestionIndex + 1,
                totalQuestions: questions.length,
                currentScore: newScore,
                quizData: {
                    apiURL,
                    username,
                    questions,
                    currentScore: newScore,
                    startIndex: currentQuestionIndex + 1
                }
            }
        });
    };

    const handleBackToForm = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className='vh-100 d-flex justify-content-center align-items-center'>
                <p>Loading questions...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className='vh-100 d-flex justify-content-center align-items-center'>
                <Container className='bg-danger p-4 rounded d-flex flex-column align-items-center' style={{ maxWidth: '600px' }}>
                    <Alert variant='danger'>{error}</Alert>
                    <Button variant='dark' onClick={handleBackToForm}>Back to Form</Button>
                </Container>
            </div>
        )
    }
    if (questions.length === 0) {
        return (
            <div className='vh-100 d-flex justify-content-center align-items-center'>
                <Container className='mt-5 bg-danger p-4 rounded d-flex flex-column align-items-center' style={{ maxWidth: '600px' }}>
                    <p>No questions available. Please try different settings.</p>
                    <Button variant='dark' onClick={handleBackToForm}>Back to Form</Button>
                </Container>
            </div>
        )
    }

    const isQuizComplete = currentQuestionIndex >= questions.length;
    if (isQuizComplete) {
        return (
            <div className='vh-100 d-flex justify-content-center align-items-center'>
                <Container className='mt-5 bg-danger p-4 rounded d-flex flex-column align-items-center' style={{ maxWidth: '600px' }}>
                    <h2 className='mb-4'>Quiz Complete, {username}!</h2>
                    <p>You've completed all the questions. Great job!</p>
                    <h3>Final Score: {score}/{questions.length}</h3>
                    <p>{Math.round((score / questions.length) * 100)}%</p>
                    <Button variant='dark' onClick={handleBackToForm}>Back to Form</Button>
                </Container>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className='vh-100 d-flex justify-content-center align-items-center'>
            <Container className='bg-danger p-4 rounded d-flex flex-column align-items-center' style={{ height: '40vh' }}>
                <h2 className='mb-4'>Trivia Question {currentQuestionIndex + 1} of {questions.length}</h2>

                {formError && <Alert variant='warning'>{formError}</Alert>}

                <Form onSubmit={handleSubmit} className='w-100'>
                    <Form.Group className='mb-4'>
                        <Form.Label dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
                    </Form.Group>

                    <Form.Group className='mb-4'>
                        <Row>
                            {currentQuestion.allAnswers.map((answer, index) => (
                                <Col key={index} xs={6} className='mb-3'>
                                    <div
                                        className='border rounded h-100 d-flex align-items-center p-3'
                                        style={{
                                            backgroundColor: selectedAnswer === answer ? '#007bff' : '#f8f9fa',
                                            color: selectedAnswer === answer ? 'white' : 'black',
                                            cursor: 'pointer',
                                            minHeight: '80px'
                                        }}
                                        onClick={() => setSelectedAnswer(answer)}
                                    >
                                        <input
                                            type='radio'
                                            id={`answer-${index}`}
                                            name='answer'
                                            value={answer}
                                            checked={selectedAnswer === answer}
                                            onChange={handleAnswerChange}
                                            style={{ display: 'none' }}
                                    />
                                        <label
                                            htmlFor={`answer-${index}`}
                                            style={{ cursor: 'pointer', margin: 0, width: '100%' }}
                                            dangerouslySetInnerHTML={{ __html: answer }}
                                        />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Form.Group>
                    <div className='d-flex justify-content-center gap-3'>
                        <Button type='submit' variant='dark'>
                            Submit Answer
                        </Button>
                        <Button variant='dark' onClick={handleBackToForm}>Back to Form</Button>
                    </div>
                </Form>

                <div className='mt-3 text-center'>
                    <h5>Current Score: {score}/{currentQuestionIndex}</h5>
                    {currentQuestionIndex > 0 && (
                        <p>{Math.round((score / currentQuestionIndex) * 100)}%</p>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default TriviaQuestion;