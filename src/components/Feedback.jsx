import '../styles/Feedback.css'

function Feedback({ feedback }) {
  if (!feedback) return null

  return (
    <div className={`feedback-msg feedback--${feedback.tipo}`}>
      {feedback.mensagem}
    </div>
  )
}

export default Feedback
