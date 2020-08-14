import React, { Component } from "react";
// Importamos las preguntas y sus respuestas
import { QuizData } from "./QuizData";

// estilos
import "./styles.css";

export class Quiz extends Component {
  constructor(props) {
    super(props);
    // Estado necesarios para que funciona esta app
    this.state = {
      userAnswer: null, // Respuesta del usuario
      currentIndex: 0, // Indice Actual
      options: [], // Array de respuestas
      quizEnd: false, // true cuando termine el quiz
      score: 0, // Puntaje
      disabled: true,
    };
  }

  // Establece una pregunta basada en el indice actual
  loadQuiz = () => {
    const { currentIndex } = this.state;
    this.setState(() => {
      return {
        question: QuizData[currentIndex].question,
        options: QuizData[currentIndex].options,
        answer: QuizData[currentIndex].answer,
      };
    });
  };

  // Esta funcion hace 2 cosas:
  // 1 - Si la respuesta es correcta,incrementa la puntuacion
  // 2 - Aumenta el indice actual (currentIndex)
  nextQuestionHandler = () => {
    const { userAnswer, answer, score } = this.state;

    // Si la respuesta es correcta
    if (userAnswer === answer) {
      this.setState({
        score: score + 1,
      });
    }
    // Si no, suma uno a la indiceActual y userAnswer se establece en null
    this.setState({
      currentIndex: this.state.currentIndex + 1,
      userAnswer: null,
    });
  };

  // Metodo de ciclo de vida el cual carga la primera pregunta cuando se monta el componente
  componentDidMount() {
    this.loadQuiz();
  }

  // Establece el estado userAnswer en la opcion seleccionada por el usuario
  checkAnswer = (answer) => {
    this.setState({
      userAnswer: answer,
      disabled: false,
    });
  };

  // Metodo ciclo de vida, cada vez que el indice actual cambia
  // entonces se cambia a la siguiente pregunta
  // tambien deshabilitamos el boton siguinte pregunta
  componentDidUpdate(prevProps, prevState) {
    const { currentIndex } = this.state;

    if (this.state.currentIndex !== prevState.currentIndex) {
      this.setState(() => {
        return {
          disabled: true,
          question: QuizData[currentIndex].question,
          options: QuizData[currentIndex].options,
          answer: QuizData[currentIndex].answer,
        };
      });
    }
  }

  // funcion para establecer el estado quizEnd en true
  // Se llama al dar click al boton finalizar
  finishHandler = () => {
    const { currentIndex, userAnswer, answer, score } = this.state;

    if (userAnswer === answer) {
      this.setState({
        score: score + 1,
      });
    }

    // Si el indiceActual es igual al total de preguntas, acabar el quiz
    if (currentIndex === QuizData.length - 1) {
      this.setState({
        quizEnd: true,
      });
    }
  };

  restarHandler = () => {
    window.location.href = "http://localhost:3002/";
  };

  // El Html :v
  render() {
    const { question, options, currentIndex, userAnswer, quizEnd } = this.state;

    // Si el quizEnd pasa a verdadedo, se acaba el quiz
    if (quizEnd) {
      return (
        <div>
          <h1>
            Se acabó el juego, la puntuación final son {this.state.score}{" "}
            puntos.
          </h1>
          <p>Las respuestas correctas de el cuestionario son:</p>
          <ol>
            {/* Mapeamos las respuestas correctas de cada pregunta */}
            {QuizData.map((item, index) => (
              <li className="options" key={index}>
                {item.answer}
              </li>
            ))}
          </ol>
          <button onClick={() => this.restarHandler()}>Reiniciar</button>
        </div>
      );
    }
    // Si quizEnd es falso mostramos la pregunta
    return (
      <div>
        <h2>{question}</h2>
        <span>{`Pregunta ${currentIndex + 1} de ${QuizData.length}`}</span>
        {/* Mapeamos las opciones de cada pregunta */}
        {options.map((option, i) => (
          <p
            key={i}
            className={`options ${userAnswer === option ? "selected" : null}`}
            onClick={() => this.checkAnswer(option)}
          >
            {option}
          </p>
        ))}
        {currentIndex < QuizData.length - 1 && (
          <button
            disabled={this.state.disabled}
            onClick={this.nextQuestionHandler}
          >
            Siguiente
          </button>
        )}
        {currentIndex === QuizData.length - 1 && (
          <button onClick={this.finishHandler} disabled={this.state.disabled}>
            Terminar Quiz
          </button>
        )}
      </div>
    );
  }
}

export default Quiz;
