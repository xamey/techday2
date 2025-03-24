from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool
from langchain_google_genai import ChatGoogleGenerativeAI

@CrewBase
class ReactCrew():
    """React crew"""
    agents_config = 'config/react_agents.yaml'
    tasks_config = 'config/react_tasks.yaml'
 
    def __init__(self):
        self.llm = LLM(
            base_url="https://openrouter.ai/api/v1",
            api_key="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",
            model="openrouter/mistralai/mistral-small-3.1-24b-instruct:free",
        )
  
    @agent
    def political_expert(self) -> Agent:
        return Agent(
            config=self.agents_config['political_expert'],
            llm=self.llm,
            verbose=True
        )
  
    @task
    def political_expert_task(self) -> Task:
        return Task(
            config=self.tasks_config['political_expert_task'],
            agent=self.political_expert()
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