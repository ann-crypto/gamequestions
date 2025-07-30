from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import random
import os

app = Flask(__name__, static_folder='static')
CORS(app)

# Carregar perguntas do arquivo JSON
with open('questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Estado do jogo
game_state = {
    'players': {
        'player1': {'name': 'Jogador 1', 'score': 0},
        'player2': {'name': 'Jogador 2', 'score': 0}
    },
    'current_player': 'player1',
    'current_question': None,
    'game_started': False,
    'game_finished': False,
    'used_questions': [],
    'max_questions': 10,  # Limite de perguntas por jogo
    'questions_asked': 0
}

@app.route('/api/start-game', methods=['POST'])
def start_game():
    """Inicia um novo jogo"""
    global game_state
    data = request.get_json()
    
    # Resetar estado do jogo
    game_state = {
        'players': {
            'player1': {'name': data.get('player1_name', 'Jogador 1'), 'score': 0},
            'player2': {'name': data.get('player2_name', 'Jogador 2'), 'score': 0}
        },
        'current_player': 'player1',
        'current_question': None,
        'game_started': True,
        'game_finished': False,
        'used_questions': [],
        'max_questions': 10,
        'questions_asked': 0
    }
    
    return jsonify({'success': True, 'game_state': game_state})

@app.route('/api/get-question', methods=['GET'])
def get_question():
    """Retorna uma pergunta aleatória que ainda não foi usada"""
    global game_state
    
    if not game_state['game_started'] or game_state['game_finished']:
        return jsonify({'error': 'Jogo não iniciado ou já finalizado'}), 400
    
    # Verificar se atingiu o limite de perguntas
    if game_state['questions_asked'] >= game_state['max_questions']:
        game_state['game_finished'] = True
        winner = determine_winner()
        return jsonify({
            'game_finished': True,
            'winner': winner,
            'final_scores': game_state['players']
        })
    
    # Filtrar perguntas não utilizadas
    available_questions = [q for q in questions if q['id'] not in game_state['used_questions']]
    
    if not available_questions:
        # Se não há mais perguntas, finalizar o jogo
        game_state['game_finished'] = True
        winner = determine_winner()
        return jsonify({
            'game_finished': True,
            'winner': winner,
            'final_scores': game_state['players']
        })
    
    # Selecionar pergunta aleatória
    question = random.choice(available_questions)
    game_state['current_question'] = question
    game_state['used_questions'].append(question['id'])
    game_state['questions_asked'] += 1
    
    # Retornar pergunta sem a resposta correta
    question_data = {
        'id': question['id'],
        'question': question['question'],
        'options': question['options'],
        'current_player': game_state['current_player'],
        'question_number': game_state['questions_asked'],
        'total_questions': game_state['max_questions']
    }
    
    return jsonify(question_data)

@app.route('/api/submit-answer', methods=['POST'])
def submit_answer():
    """Processa a resposta do jogador"""
    global game_state
    
    data = request.get_json()
    answer = data.get('answer')
    
    if not game_state['current_question']:
        return jsonify({'error': 'Nenhuma pergunta ativa'}), 400
    
    # Verificar se a resposta está correta
    correct_answer = game_state['current_question']['answer']
    is_correct = answer == correct_answer
    
    # Atualizar pontuação se correto
    if is_correct:
        game_state['players'][game_state['current_player']]['score'] += 1
    
    # Alternar jogador
    game_state['current_player'] = 'player2' if game_state['current_player'] == 'player1' else 'player1'
    
    # Limpar pergunta atual
    current_question = game_state['current_question']
    game_state['current_question'] = None
    
    return jsonify({
        'correct': is_correct,
        'correct_answer': correct_answer,
        'current_player': game_state['current_player'],
        'scores': game_state['players']
    })

@app.route('/api/game-state', methods=['GET'])
def get_game_state():
    """Retorna o estado atual do jogo"""
    return jsonify(game_state)

@app.route('/')
def serve_frontend():
    """Serve o frontend React"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    """Serve arquivos estáticos do frontend"""
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # Se o arquivo não existir, serve o index.html (para roteamento do React)
        return send_from_directory(app.static_folder, 'index.html')

def determine_winner():
    """Determina o vencedor do jogo"""
    player1_score = game_state['players']['player1']['score']
    player2_score = game_state['players']['player2']['score']
    
    if player1_score > player2_score:
        return game_state['players']['player1']['name']
    elif player2_score > player1_score:
        return game_state['players']['player2']['name']
    else:
        return 'Empate'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

