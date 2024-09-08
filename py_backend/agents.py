import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain.schema import StrOutputParser
from langchain.schema.runnable import RunnablePassthrough


def read_sys_instruction():
    with open('sys_instruction.txt', 'r') as f:
        text = f.read()
    return text

class Template():
    def __init__(self):
        self.system_instruction = read_sys_instruction()

        self.user_message_template = """
        ###Type###: {type} \n
        ###Profile###: {profile} \n
        ###Company###: {company} \n
        ###Job Description###: {job_description} \n
        ###User Requests###: {user_request}
        """
        
        self.system_message = SystemMessagePromptTemplate.from_template(self.system_instruction)
        self.user_message = HumanMessagePromptTemplate.from_template(
            self.user_message_template, input_variables=['type', 'profile', 'company', 'job_description', 'user_request'])
        
        self.prompt_template = ChatPromptTemplate.from_messages([self.system_message, self.user_message])


class Gemini_Agent():
    def __init__(self, model_name):
        load_dotenv()
        self.api_key = os.environ["GEMINI_API_KEY"]
        self.model = ChatGoogleGenerativeAI(
            api_key=self.api_key,
            model=model_name,
            temperature=0.8,
            max_tokens=8192,
            top_p=0.9)

        self.prompt = Template()
        self.chain = RunnablePassthrough() | self.prompt.prompt_template | self.model | StrOutputParser()

    def write(self, type, profile, company, job_description, user_request):
        return self.chain.invoke(
            {'type': type,
             'profile': profile, 
             'company': company,
             'job_description': job_description,
             'user_request' : user_request, })
    
class GPT_Agent():
    def __init__(self, model_name):
        load_dotenv()
        self.api_key = os.environ["OPENAI_API_KEY"]
        self.model = ChatOpenAI(
            api_key=self.api_key,
            model=model_name,
            temperature=0.8,
            max_tokens=8192,
            top_p=0.9)

        self.prompt = Template()
        self.chain = RunnablePassthrough() | self.prompt.prompt_template | self.model | StrOutputParser()

    def write(self, type, profile, company, job_description, user_request):
        return self.chain.invoke(
            {'type': type,
             'profile': profile, 
             'company': company,
             'job_description': job_description,
             'user_request' : user_request, })