# port.py
import os
import logging
from API.AI import client  # Or wherever your LLM client is configured

logger = logging.getLogger(__name__)


class RugbyAssistant:
    def __init__(self):
        # Find the current file's directory
        dir_path = os.path.dirname(os.path.realpath(__file__))
        # Assume you have a text file with your UMBC Rugby info
        file_path = os.path.join(dir_path, "about_rugby.txt")

        # Read the "about" text from file
        with open(file_path, "r", encoding="utf-8") as f:
            self.about_text = f.read()

        logger.info("RugbyAssistant initialized. Info length: %d", len(self.about_text))

    def ask_rugby(self, question: str, stream: bool = False):
        """
        Takes a question about UMBC Rugby and returns an AI-generated answer.
        If stream=True, yields chunked responses for streaming in real-time.
        """
        system_message = (
            "You are an AI assistant who knows everything about UMBC Rugby. "
            "Use the following context to answer any questions:\n\n"
            f"{self.about_text}\n\n"
            "Answer concisely, and if certain info is missing, make it up in a positive or 'on-brand' way. "
            "If you are unsure, guess in a way consistent with UMBC Rugby's culture and vibe."
        )

        if stream:
            return self._streaming(system_message, question)
        else:
            return self._single_response(system_message, question)

    def _single_response(self, system_message: str, user_question: str) -> str:
        try:
            res = client.chat.completions.create(
                model="gpt-4o",  # Or whichever model you’re using
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_question}
                ],
                max_tokens=500,
                temperature=0.5
            )
            answer = res.choices[0].message.content.strip()
            logger.debug("Single-response answer: %s", answer)
            return answer
        except Exception as e:
            logger.error("Error generating single response: %s", e)
            raise

    def _streaming(self, system_message: str, user_question: str):
        """
        Generator function that yields the response in chunks (if your LLM supports streaming).
        """
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_question}
                ],
                max_tokens=500,
                temperature=0.5,
                stream=True
            )
            # Yield chunks of text
            for chunk in response:
                if chunk.choices:
                    delta = chunk.choices[0].delta
                    chunk_content = getattr(delta, "content", None)
                    if chunk_content:
                        yield chunk_content
        except Exception as e:
            logger.error("Error during streaming: %s", str(e))
            yield f"[Error during streaming: {str(e)}]"
