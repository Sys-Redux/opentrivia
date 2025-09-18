import { useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get data from react router state
    const { username, isCorrect, correctAnswer, userAnswer, questionNumber, totalQuestions, currentScore, quizData } = location.state || {};

    // Redirect home if no state
    if (!username || isCorrect === undefined) {
        navigate('/');
        return null;
    }

    const handleStartOver = () => {
        navigate('/');
    };

    const handleNextQuestion = () => {
        navigate('/questions', {
            state: quizData
        });
    };

    const isLastQuestion = questionNumber >= totalQuestions;
    const percentage = Math.round((currentScore / totalQuestions) * 100);

    return (
        <div className='vh-100 d-flex justify-content-center align-items-center'>
            <Container className='bg-danger p-4 rounded d-flex flex-column align-items-center' style={{ maxWidth: '600px' }}>
                <h2 className='mb-4 text-center'>Question {questionNumber} Results</h2>
                {isCorrect ? (
                    <Alert variant='success' className='text-center'>
                        <h4>Congratulations, {username}!</h4>
                        <p>You answered correctly! 🎉🎉🎉</p>
                    </Alert>
                ) : (
                    <Alert variant='danger' className='text-center'>
                        <h4>Sorry, {username}.</h4>
                        <p>You answered incorrectly. 😥</p>
                        <hr />
                        <p><strong>Your answer:</strong> <span dangerouslySetInnerHTML={{ __html: userAnswer }} /></p>
                        <p><strong>Correct answer:</strong> <span dangerouslySetInnerHTML={{ __html: correctAnswer }} /></p>
                    </Alert>
                )}

                {/* Score Summary */}
                <div className='mb-4 text-center'>
                    <h4>Score: {currentScore}/{questionNumber}</h4>
                    <p>{percentage}%</p>
                </div>

                {isLastQuestion && (
                    <div className='mb-3 text-center'>
                        <h3>🎉 Quiz Completed! 🎉</h3>
                        <h4>Final Score: {currentScore}/{totalQuestions}</h4>
                        <p>{Math.round((currentScore / totalQuestions) * 100)}%</p>
                        {currentScore === totalQuestions && <p className='text-success'><strong>Perfect Score! 🎉</strong></p>}
                        {currentScore >= totalQuestions * 0.8 && currentScore < totalQuestions && <p className='text-info'><strong>Great Job! 🎉</strong></p>}
                        {currentScore >= totalQuestions * 0.6 && currentScore < totalQuestions * 0.8 && <p className='text-warning'><strong>Good Effort! 👍</strong></p>}
                        {currentScore < totalQuestions * 0.6 && <p className='text-muted'><strong>Keep Practicing! 💪</strong></p>}
                    </div>
                )}

                <div className='d-flex justify-content-center gap-3 mt-3'>
                    {!isLastQuestion ? (
                        <Button variant='dark' onClick={handleNextQuestion}>Next Question</Button>
                    ) : (
                        <Button variant='success' onClick={handleStartOver}>Start Over</Button>
                    )}
                    <Button variant='secondary' onClick={handleStartOver}>Back to Form</Button>
                </div>
            </Container>
        </div>
    );
};

export default Results;