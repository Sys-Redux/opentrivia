import HomePageForm from './components/HomePageForm'
import TriviaQuestion from './components/TriviaQuestion'
import Results from './components/Results'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePageForm />} />
        <Route path='/questions' element={<TriviaQuestion />} />
        <Route path='/results' element={<Results />} />
      </Routes>
    </>
  )
}

export default App
