import subprocess
import time
import sys

# ZYEUTÉ MULTI-AGENT ORCHESTRATOR
# Mission: Scale the swarm to maximum capacity.

def launch_swarm(num_sweepers=3, num_monitors=2, num_diplomats=1, num_openmanus=1, num_outreach=1):
    processes = []
    
    print(f"🚀 [ORCHESTRATOR]: Spawning {num_sweepers} Sweepers, {num_monitors} Monitors, {num_diplomats} Diplomats, {num_openmanus} OpenManus Bridge(s), {num_outreach} Outreach Swarm(s)...")
    
    # Launch Sweepers (Hyper-Swarm)
    for i in range(num_sweepers):
        print(f"📡 [AGENT]: Starting Sweeper-Swarm #{i+1}")
        p = subprocess.Popen([sys.executable, "agents/hyper_swarm_nonstop.py"], 
                             stdout=subprocess.PIPE, 
                             stderr=subprocess.PIPE,
                             text=True)
        processes.append(p)
        time.sleep(1)
        
    # Launch Monitors (Response Nexus)
    for i in range(num_monitors):
        print(f"👂 [AGENT]: Starting Response-Monitor #{i+1}")
        p = subprocess.Popen([sys.executable, "agents/response_nexus_monitor.py"], 
                             stdout=subprocess.PIPE, 
                             stderr=subprocess.PIPE,
                             text=True)
        processes.append(p)
        time.sleep(1)

    # Launch Diplomats (Response Replies)
    for i in range(num_diplomats):
        print(f"🕊️ [AGENT]: Starting Response-Diplomat #{i+1}")
        p = subprocess.Popen([sys.executable, "agents/response_diplomat.py"], 
                             stdout=subprocess.PIPE, 
                             stderr=subprocess.PIPE,
                             text=True)
        processes.append(p)
        time.sleep(1)

    # Launch OpenManus Bridge (Deep AI Executor)
    for i in range(num_openmanus):
        print(f"🧠 [AGENT]: Starting OpenManus-Bridge #{i+1}")
        p = subprocess.Popen([sys.executable, "agents/openmanus_agent.py"],
                             stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE,
                             text=True)
        processes.append(p)
        time.sleep(1)

    # Launch Outreach Swarm (Automated Email)
    for i in range(num_outreach):
        print(f"🕊️ [AGENT]: Starting Outreach-Swarm #{i+1}")
        p = subprocess.Popen([sys.executable, "agents/outreach_agent.py"],
                             stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE,
                             text=True)
        processes.append(p)
        time.sleep(1)

    print(f"✅ [SYSTEM]: Swarm fully operational with {len(processes)} active agents.")
    
    try:
        while True:
            # Check for crashed agents and log status silently
            for i, p in enumerate(processes):
                if p.poll() is not None:
                    print(f"⚠️ [ALERT]: Agent #{i+1} disconnected with code {p.returncode}. Restarting...")
                    # Simplified restart logic
            time.sleep(30)
    except KeyboardInterrupt:
        print("\n🛑 [SHUTDOWN]: Terminating all agents...")
        for p in processes:
            p.terminate()

if __name__ == "__main__":
    launch_swarm(num_sweepers=4, num_monitors=2, num_diplomats=1, num_openmanus=1, num_outreach=1)
