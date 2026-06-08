import httpx
import asyncio
import json
OLLAMA_URL="http://localhost:11434/api/chat"

async def send_prompt(prompt:str, 
                            ):
    payload={
                "model": "llama3:instruct",
                "messages": [
                      {
                          "role": "user", 
                          "content": prompt
                      }
                  ],
                "stream": True
        }
   
    async with httpx.AsyncClient() as client:
        async with client.stream(method="POST",url=OLLAMA_URL,json=payload) as response:
            async for line in response.aiter_lines():
                
                
                data=json.loads(line)
                if(data["done"]):
                    print()
                    break

                chunk=data["message"]["content"]
                
                print(chunk,end="",flush=True)
    
    
   

asyncio.run(send_prompt("meow"))

    


