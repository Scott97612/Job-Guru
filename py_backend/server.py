from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import os
import logging

from pdf_extract import pdf_to_text
from ocr import img2text
from agents import Gemini_Agent, GPT_Agent

logging.basicConfig(level=logging.DEBUG)
FRONTEND_ENDPOINT = "http://localhost:5173"

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": FRONTEND_ENDPOINT}})
socketio = SocketIO(app, cors_allowed_origins=FRONTEND_ENDPOINT)

output_cache = []

model_dict = {
    'Gemini-1.5-Flash': 'gemini-1.5-flash',
    'Gemini-1.5-Pro': 'gemini-1.5-pro',
    'GPT-4o': 'gpt-4o',
    'GPT-4o-mini': 'gpt-4o-mini',
}


@app.route('/api-post-data', methods=['POST'])
def post_data():
    if not request.form:
        return jsonify({'error': 'Missing data'}), 400

    # Emit a "processing" event to notify the frontend
    socketio.emit('processing', {'status': 'Processing data...'})

    try:
        # Get output type
        type = request.form['type']

        # Get PDF text
        pdf_file = request.files['pdf']
        pdf_path = os.path.join('uploads', 'profile.pdf')
        pdf_file.save(pdf_path)
        profile_text = pdf_to_text(pdf_path)
        os.remove(pdf_path)

        # Get job description text
        if request.form['job_description'] and not request.files['job_description_image']:
            # if only text and not image
            job_description  = request.form['job_description']
        elif request.form['job_description'] and request.files['job_description_image']: 
            # if there are both text and image
            job_description_image = request.files['job_description_image']
            image_path = os.path.join('uploads', 'job_description_image.png')
            job_description_image.save(image_path)
            job_description = request.form['job_description'] + '\n' + img2text(image_path)
            os.remove(image_path)
        elif not request.form['job_description'] and request.files['job_description_image']:
            # no text just image
            job_description_image = request.files['job_description_image']
            image_path = os.path.join('uploads', 'job_description_image.png')
            job_description_image.save(image_path)
            job_description = img2text(image_path)
            os.remove(image_path)
        else:
            # empty
            job_description = None

        # Get company description text
        if request.form['company_description'] and not request.files['company_description_image']:
            # if only text and not image
            company_description  = request.form['company_description']
        elif request.form['company_description'] and request.files['company_description_image']: 
            # if there are both text and image
            company_description_image = request.files['company_description_image']
            image_path = os.path.join('uploads', 'company_description_image.png')
            company_description_image.save(image_path)
            company_description = request.form['company_description'] + '\n' + img2text(image_path)
            os.remove(image_path)
        elif not request.form['company_description'] and request.files['company_description_image']:
            # no text just image
            company_description_image = request.files['company_description_image']
            image_path = os.path.join('uploads', 'company_description_image.png')
            company_description_image.save(image_path)
            company_description = img2text(image_path)
            os.remove(image_path)
        else:
            # empty
            company_description = None

        # Get user request text
        user_request = request.form['user_request']

        # Get model name text
        model = request.form['model_name']

        # run the correct model
        if model == 'Gemini-1.5-Flash':
            agent = Gemini_Agent(model_name=model_dict['Gemini-1.5-Flash'])
            output = agent.write(type=type, profile=profile_text, company=company_description, job_description=job_description, user_request=user_request)
        elif model == 'Gemini-1.5-Pro':
            agent = GPT_Agent(model_name=model_dict['Gemini-1.5-Pro'])
            output = agent.write(type=type, profile=profile_text, company=company_description, job_description=job_description, user_request=user_request)
        elif model == 'GPT-4o':
            agent = GPT_Agent(model_name=model_dict['GPT-4o'])
            output = agent.write(type=type, profile=profile_text, company=company_description, job_description=job_description, user_request=user_request)
        elif model == 'GPT-4o-mini':
            agent = GPT_Agent(model_name=model_dict['GPT-4o-mini'])
            output = agent.write(type=type, profile=profile_text, company=company_description, job_description=job_description, user_request=user_request)

        output_cache.append(output)

        # Emit a "complete" event to notify the frontend that processing is done
        socketio.emit('complete', {'status': 'Writing complete'})

        return jsonify({
            'message': 'Data processing complete'
        }), 200

    except Exception as e:
        socketio.emit('error', {'status': f'Error: {str(e)}'})
        return jsonify({'error': str(e)}), 500
    
@app.route('/api-get-output', methods=['GET'])
def get_output():
    if output_cache:
        return jsonify({'output': output_cache[-1]}), 200
    else:
        return jsonify({'error': 'No output available'}), 404
    
@app.route('/api-reset', methods=['POST'])
def reset():
    if 'action' in request.form and request.form['action'] == 'reset':
        # reset backend data
        output_cache = []
        # logging.debug(f'Here are data lists: {translation_result}, {transcription_result}')
        return jsonify({'message': "Data reset successfully"}), 200 
    else:
        return jsonify({"message": "No data received"}), 400 

if __name__ == '__main__':
    socketio.run(app, debug=True)