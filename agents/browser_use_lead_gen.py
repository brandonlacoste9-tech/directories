# scripts/browser_use_lead_gen.py
import asyncio
from browser_use import Agent
from langchain_openai import ChatOpenAI
import os

# 1. Initialize the LLM (OpenAI is standard for Browser-Use in 2026)
llm = ChatOpenAI(model="gpt-4o")


async def QuebecRegistryLeadGen():
    """
    Agentic Lead Generation for Quebec Businesses (Bill 96 Compliance Swarm)
    Target: Registraire des entreprises (REQ)
    Objective: Find businesses with 25+ employees but no 'Verified Compliance' seal.
    """

    task = """
    1. Navigate to 'https://www.quebec.ca/entreprises/registraire-entreprises/rechercher-information-entreprise'
    2. Perform an advanced search for businesses registered in the 'Montréal' or 'Laval' regions.
    3. Filter for establishments with '25 à 49 salariés' or '50 à 99 salariés'.
    4. For each result:
       - Extract: Legal Name (FR), NEQ (ID), Establishment Address.
       - Find the official website URL if listed.
    5. Visit the company's website:
       - Check if the page is serving English-first content.
       - Look for the 'Terms of Service' page and verify if it is in French.
    6. Return a JSON list of businesses that are LIKELY NON-COMPLIANT (e.g., 25+ employees but no French Terms of Service).
    7. Save findings to 'leads_batch_march2026.json'.
    """

    agent = Agent(
        task=task,
        llm=llm,
    )

    print("🚀 INITIALIZING SWARM (LEAD_GEN_AGENT)...")
    result = await agent.run()
    print("✅ SWARM COMPLETED AUDIT.")
    print(f"Results: {result}")


if __name__ == "__main__":
    asyncio.run(QuebecRegistryLeadGen())
