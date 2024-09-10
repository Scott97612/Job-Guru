from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import os
import logging

from pdf_extract import pdf_to_text
from ocr import img2text
from agents import Gemini_Agent, GPT_Agent, Claude_Agent

logging.basicConfig(level=logging.DEBUG)
FRONTEND_ENDPOINT = "http://localhost:5173"
upload_folder = 'uploads'

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": FRONTEND_ENDPOINT}})
socketio = SocketIO(app, cors_allowed_origins=FRONTEND_ENDPOINT)

output_cache = []

model_dict = {
    'Gemini-1.5-Flash': 'gemini-1.5-flash',
    'GPT-4o': 'gpt-4o',
    'GPT-4o-mini': 'gpt-4o-mini',
    'Claude-Sonnet-3.5': 'claude-3-5-sonnet-20240620'
}

@app.route('/api-post-data', methods=['POST'])
def post_data():
    try:
        # Check if the request contains form data or files
        if 'multipart/form-data' in request.headers.get('Content-Type'):
            # Get the form data and files
            form_data = request.form.to_dict()
            files = request.files

            # Emit a "processing" event to notify the frontend
            socketio.emit('processing', {'status': 'Processing data...'})

            # Get output type
            type = form_data['type']

            # Get PDF text
            pdf_file = files.get('pdf')
            if pdf_file:
                pdf_path = os.path.join(upload_folder, 'profile.pdf')
                pdf_file.save(pdf_path)
                profile_text = pdf_to_text(pdf_path)
                os.remove(pdf_path)
            else:
                profile_text = None

            # Get job description text
            job_description_text = form_data.get('job_description')
            job_description_image = files.get('job_description_image')
            if job_description_image:
                image_path = os.path.join(upload_folder, 'job_description_image.png')
                job_description_image.save(image_path)
                job_description_text = form_data.get('job_description', '') + '\n' + img2text(image_path)
                os.remove(image_path)
            else:
                job_description_text = form_data.get('job_description')

            # Get company description text
            company_description_text = form_data.get('company_description')
            company_description_image = files.get('company_description_image')
            if company_description_image:
                image_path = os.path.join(upload_folder, 'company_description_image.png')
                company_description_image.save(image_path)
                company_description_text = form_data.get('company_description', '') + '\n' + img2text(image_path)
                os.remove(image_path)
            else:
                company_description_text = form_data.get('company_description')

            # Get user request text
            user_request = form_data['user_request']

            # Get model name text
            model = form_data['model_name']

            # logging.debug(type, company_description_text[:50], job_description_text[:50], profile_text[:50], user_request, model)

            # Run the correct model
            if model == 'Gemini-1.5-Flash':
                agent = Gemini_Agent(model_name=model_dict['Gemini-1.5-Flash'])
                output = agent.write(type=type, profile=profile_text, company=company_description_text, job_description=job_description_text, user_request=user_request)
            elif model == 'GPT-4o':
                agent = GPT_Agent(model_name=model_dict['GPT-4o'])
                output = agent.write(type=type, profile=profile_text, company=company_description_text, job_description=job_description_text, user_request=user_request)
            elif model == 'GPT-4o-mini':
                agent = GPT_Agent(model_name=model_dict['GPT-4o-mini'])
                output = agent.write(type=type, profile=profile_text, company=company_description_text, job_description=job_description_text, user_request=user_request)
            elif model == 'Claude-Sonnet-3.5':
                agent = Claude_Agent(model_name=model_dict['Claude-Sonnet-3.5'])
                output = agent.write(type=type, profile=profile_text, company=company_description_text, job_description=job_description_text, user_request=user_request)

            output_cache.append(output)

            # Emit a "complete" event to notify the frontend that processing is done
            socketio.emit('complete', {'status': 'Writing complete'})

            return jsonify({
                'message': 'Data processing complete'
            }), 200
        else:
            return jsonify({'error': 'Missing multipart/form-data in the request'}), 400

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