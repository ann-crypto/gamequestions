import React, { useState, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Trophy, Users, Brain, Play, RotateCcw } from 'lucide-react';

const API_BASE = '/api';

function App() {
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [players, setPlayers] = useState({
    player1: { name: '', score: 0 },
    player2: { name: '', score: 0 }
  });
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [winner, setWinner] = useState(null);

  const startGame = async () => {
    try {
      const response = await fetch(`${API_BASE}/start-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player1_name: players.player1.name || 'Jogador 1',
          player2_name: players.player2.name || 'Jogador 2'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setPlayers(data.game_state.players);
        setCurrentPlayer(data.game_state.current_player);
        setGameState('playing');
        getNextQuestion();
      }
    } catch (error) {
      console.error('Erro ao iniciar o jogo:', error);
    }
  };

  const getNextQuestion = async () => {
    try {
      const response = await fetch(`${API_BASE}/get-question`);
      const data = await response.json();
      
      if (data.game_finished) {
        setWinner(data.winner);
        setPlayers(data.final_scores);
        setGameState('finished');
      } else {
        setCurrentQuestion(data);
        setCurrentPlayer(data.current_player);
        setSelectedAnswer('');
        setShowResult(false);
      }
    } catch (error) {
      console.error('Erro ao buscar pergunta:', error);
    }
  };

  const submitAnswer = async () => {
    if (!selectedAnswer) return;

    try {
      const response = await fetch(`${API_BASE}/submit-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: selectedAnswer })
      });
      
      const data = await response.json();
      setLastResult(data);
      setPlayers(data.scores);
      setCurrentPlayer(data.current_player);
      setShowResult(true);
      
      setTimeout(() => {
        getNextQuestion();
      }, 3000);
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setPlayers({
      player1: { name: '', score: 0 },
      player2: { name: '', score: 0 }
    });
    setCurrentPlayer('player1');
    setCurrentQuestion(null);
    setSelectedAnswer('');
    setShowResult(false);
    setLastResult(null);
    setWinner(null);
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Brain className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Perguntados
            </CardTitle>
            <p className="text-gray-600">Jogo para dois jogadores</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Jogador 1
              </label>
              <Input
                type="text"
                placeholder="Digite o nome do jogador 1"
                value={players.player1.name}
                onChange={(e) => setPlayers(prev => ({
                  ...prev,
                  player1: { ...prev.player1, name: e.target.value }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Jogador 2
              </label>
              <Input
                type="text"
                placeholder="Digite o nome do jogador 2"
                value={players.player2.name}
                onChange={(e) => setPlayers(prev => ({
                  ...prev,
                  player2: { ...prev.player2, name: e.target.value }
                }))}
              />
            </div>
            <Button 
              onClick={startGame} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" />
              Iniciar Jogo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="h-12 w-12 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Jogo Finalizado!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="text-xl font-semibold text-gray-800">
              {winner === 'Empate' ? 'Empate!' : `Vencedor: ${winner}`}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{players.player1.name}</span>
                <Badge variant="secondary">{players.player1.score} pontos</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{players.player2.name}</span>
                <Badge variant="secondary">{players.player2.score} pontos</Badge>
              </div>
            </div>
            <Button 
              onClick={resetGame} 
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Jogar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com pontuação */}
        <div className="flex justify-between items-center mb-6">
          <Card className="flex-1 mr-2">
            <CardContent className="p-4 text-center">
              <div className="font-semibold text-gray-800">{players.player1.name}</div>
              <div className="text-2xl font-bold text-blue-600">{players.player1.score}</div>
            </CardContent>
          </Card>
          
          <div className="flex items-center mx-4">
            <Users className="h-6 w-6 text-gray-600" />
          </div>
          
          <Card className="flex-1 ml-2">
            <CardContent className="p-4 text-center">
              <div className="font-semibold text-gray-800">{players.player2.name}</div>
              <div className="text-2xl font-bold text-purple-600">{players.player2.score}</div>
            </CardContent>
          </Card>
        </div>

        {/* Indicador do jogador atual e progresso */}
        <div className="text-center mb-6 space-y-3">
          <Badge 
            variant="outline" 
            className={`text-lg px-4 py-2 ${
              currentPlayer === 'player1' ? 'border-blue-600 text-blue-600' : 'border-purple-600 text-purple-600'
            }`}
          >
            Vez de: {currentPlayer === 'player1' ? players.player1.name : players.player2.name}
          </Badge>
          
          {currentQuestion && (
            <div className="text-sm text-gray-600">
              Pergunta {currentQuestion.question_number} de {currentQuestion.total_questions}
            </div>
          )}
        </div>

        {/* Pergunta */}
        {currentQuestion && !showResult && (
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-center text-gray-800">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    className={`p-4 h-auto text-left justify-start ${
                      selectedAnswer === option 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedAnswer(option)}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)})</span>
                    {option}
                  </Button>
                ))}
              </div>
              <Button 
                onClick={submitAnswer}
                disabled={!selectedAnswer}
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Confirmar Resposta
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Resultado */}
        {showResult && lastResult && (
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className={`text-2xl font-bold mb-4 ${
                lastResult.correct ? 'text-green-600' : 'text-red-600'
              }`}>
                {lastResult.correct ? '✅ Correto!' : '❌ Incorreto!'}
              </div>
              <div className="text-gray-700">
                <strong>Resposta correta:</strong> {lastResult.correct_answer}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Próxima pergunta em alguns segundos...
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default App;

