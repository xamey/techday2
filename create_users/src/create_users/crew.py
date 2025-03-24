from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool
from langchain_google_genai import ChatGoogleGenerativeAI

@CrewBase
class CreateUsersCrew():
	"""CreateUsers crew"""
	agents_config = 'config/agents.yaml'
	tasks_config = 'config/tasks.yaml'

	def __init__(self):
		self.llm = LLM(
			api_key="AIzaSyCBR7PjXFpgZ3OFgxriqqqEqOQqpvj1u_Q",
			model="gemini/gemini-2.0-flash",
		)

	@agent
	def political_expert(self) -> Agent:
		return Agent(
			config=self.agents_config['political_expert'],
			llm=self.llm,
			verbose=True
		)
  
	@agent
	def social_media_expert(self) -> Agent:
		return Agent(
			config=self.agents_config['social_media_expert'],
			llm=self.llm,
			verbose=True,
		)

	@task
	def political_expert_task(self) -> Task:
		return Task(
			config=self.tasks_config['political_expert_task'],
			agent=self.political_expert()
		)

	@task
	def social_media_expert_task(self) -> Task:
		return Task(
			config=self.tasks_config['social_media_expert_task'],
			agent=self.social_media_expert()
		)

	@crew
	def crew(self) -> Crew:
		"""Creates the CreateUsers crew"""
		return Crew(
			agents=self.agents, # Automatically created by the @agent decorator
			tasks=self.tasks, # Automatically created by the @task decorator
			process=Process.sequential,
			verbose=True,
			# process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
		)