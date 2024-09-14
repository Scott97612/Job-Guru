from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from threading import Thread

from pdf_extract import pdf_to_text
from ocr import img2text
from agents import Gemini_Agent, GPT_Agent, Claude_Agent

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
upload_folder = 'uploads'

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

output_cache = {}
processing_cache = {}

model_dict = {
    'Gemini-1.5-Flash': 'gemini-1.5-flash',
    'GPT-4o': 'gpt-4o-2024-08-06',
    'GPT-4o-mini': 'gpt-4o-mini',
    'Claude-Sonnet-3.5': 'claude-3-5-sonnet-20240620'
}

def process_data(session_id, type, profile_text, company_description_text, job_description_text, user_request, model):
    logger.info(f"Starting process_data for session {session_id}")
    try:
        if model == 'Gemini-1.5-Flash':
            agent = Gemini_Agent(model_name=model_dict['Gemini-1.5-Flash'])
        elif model == 'GPT-4o':
            agent = GPT_Agent(model_name=model_dict['GPT-4o'])
        elif model == 'GPT-4o-mini':
            agent = GPT_Agent(model_name=model_dict['GPT-4o-mini'])
        elif model == 'Claude-Sonnet-3.5':
            agent = Claude_Agent(model_name=model_dict['Claude-Sonnet-3.5'])
        else:
            raise ValueError(f"Unknown model: {model}")

        logger.info(f"Agent created for model: {model}")
        output = agent.write(type=type, profile=profile_text, company=company_description_text, job_description=job_description_text, user_request=user_request)
        logger.info(f"Agent write complete for session {session_id}")
        output_cache[session_id] = output
        processing_cache[session_id] = False
        logger.info(f"Output stored in cache for session {session_id}")
    except Exception as e:
        logger.error(f"Error processing data for session {session_id}: {str(e)}")
        processing_cache[session_id] = False
        output_cache[session_id] = f"Error: {str(e)}"

@app.route('/api-post-data', methods=['POST'])
def post_data():
    logger.info("Received POST request to /api-post-data")
    try:
        if 'multipart/form-data' not in request.headers.get('Content-Type', ''):
            return jsonify({'error': 'Missing multipart/form-data in the request'}), 400

        form_data = request.form.to_dict()
        files = request.files

        if not form_data and not files:
            return jsonify({'error': 'Data received is empty'}), 400

        session_id = request.headers.get('X-Session-ID')
        if not session_id:
            return jsonify({'error': 'Missing session ID'}), 400

        logger.info(f"Processing data for session {session_id}")
        processing_cache[session_id] = True

        type = form_data['type']
        pdf_file = files.get('pdf')
        profile_text = None
        if pdf_file:
            pdf_path = os.path.join(upload_folder, f'{session_id}_profile.pdf')
            pdf_file.save(pdf_path)
            profile_text = pdf_to_text(pdf_path)
            os.remove(pdf_path)

        job_description_text = form_data.get('job_description', '')
        job_description_image = files.get('job_description_image')
        if job_description_image:
            image_path = os.path.join(upload_folder, f'{session_id}_job_description_image.png')
            job_description_image.save(image_path)
            job_description_text += '\n' + img2text(image_path)
            os.remove(image_path)

        company_description_text = form_data.get('company_description', '')
        company_description_image = files.get('company_description_image')
        if company_description_image:
            image_path = os.path.join(upload_folder, f'{session_id}_company_description_image.png')
            company_description_image.save(image_path)
            company_description_text += '\n' + img2text(image_path)
            os.remove(image_path)

        user_request = form_data['user_request']
        model = form_data['model_name']

        thread = Thread(target=process_data, args=(session_id, type, profile_text, company_description_text, job_description_text, user_request, model))
        thread.start()

        return jsonify({'message': 'Data processing started'}), 202
    except Exception as e:
        logger.error(f"Error in post_data: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api-get-output', methods=['GET'])
def get_output():
    logger.info("Received GET request to /api-get-output")
    session_id = request.headers.get('X-Session-ID')
    if not session_id:
        logger.error("Missing session ID in GET request")
        return jsonify({'error': 'Missing session ID'}), 400

    logger.info(f"Attempting to retrieve output for session {session_id}")
    if session_id in processing_cache and processing_cache[session_id]:
        return jsonify({'status': 'processing'}), 202
    elif session_id in output_cache:
        output = output_cache.pop(session_id)
        processing_cache.pop(session_id, None)
        logger.info(f"Output found and retrieved for session {session_id}")
        return jsonify({'output': output}), 200
    else:
        logger.warning(f"No output available for session {session_id}")
        return jsonify({'error': 'No output available'}), 404

@app.route('/api-reset', methods=['POST'])
def reset():
    session_id = request.headers.get('X-Session-ID')
    if not session_id:
        return jsonify({'error': 'Missing session ID'}), 400

    if 'action' in request.form and request.form['action'] == 'reset':
        output_cache.pop(session_id, None)
        processing_cache.pop(session_id, None)
        return jsonify({'message': "Data reset successfully"}), 200 
    else:
        return jsonify({"message": "No data received"}), 400 

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)