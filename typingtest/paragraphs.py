"""
Paragraph bank for the typing test, grouped by difficulty.

Each difficulty has multiple paragraphs so the user gets variety.
Keep paragraphs between 150-400 characters for a balanced test experience.
"""

PARAGRAPHS = {
    "easy": [
        "The sun is warm today. I like to walk in the park with my dog. The sky is blue and the birds are singing. It is a good day to be outside and enjoy the fresh air.",
        "My cat likes to sleep on the couch. She is very lazy but I love her. Every morning she waits by her bowl for food. After eating she goes right back to sleep.",
        "I went to the store to buy some milk and bread. The store was not very busy today. I also got some apples and oranges. I like to eat fruit every day.",
        "Reading books is one of my favorite things to do. I like stories about animals and nature. Books can take you to many places without leaving your room.",
        "The rain is falling outside my window. I can hear it on the roof. It makes me feel calm and happy. I like to drink tea and read when it rains.",
    ],
    "medium": [
        "Learning to code is an exciting journey that requires patience, practice, and determination. Every programmer starts as a beginner, and the key to success is writing code every single day. Don't be afraid to make mistakes; they are the best teachers.",
        "Django is a powerful web framework written in Python. It follows the model-template-view architectural pattern and encourages rapid development. With Django, you can build secure, scalable web applications quickly and efficiently.",
        "The internet has transformed how we communicate, learn, and work. From social media to online education, technology continues to shape our daily lives in remarkable ways. Understanding how the web works is a valuable skill for everyone.",
        "A balanced diet includes fruits, vegetables, whole grains, and lean proteins. Drinking enough water throughout the day is equally important. Regular exercise combined with good nutrition leads to a healthier, more energetic lifestyle.",
        "Traveling to new places broadens your perspective and helps you understand different cultures. Whether you explore a nearby town or fly across the world, every journey teaches you something valuable about yourself and others.",
    ],
    "hard": [
        "In Python 3.13, the `match` statement (PEP 634) allows structural pattern matching with guards: `case [x, y] if x > 0:`. This feature, combined with type hints like `dict[str, list[int]]`, makes code both expressive & maintainable. Remember: 2**10 = 1024!",
        "The quick brown fox jumps over the lazy dog! But did you know that \"Pack my box with 5 dozen liquor jugs\" also contains every letter of the alphabet? Pangrams are useful for testing fonts & keyboards. #TypingTest @2026 — $19.99/month.",
        "JavaScript's `async/await` syntax simplifies asynchronous programming. For example: `const data = await fetch('https://api.example.com/v2/users?id=42&sort=desc');` handles promises elegantly. Error handling uses try/catch blocks — a pattern borrowed from C++ & Java (circa 1995).",
        "Database normalization follows rules: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies). A query like `SELECT COUNT(*) FROM users WHERE age >= 18 AND status != 'inactive';` demonstrates SQL's power. Performance tip: always index frequently-queried columns!",
        "RegEx pattern `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$` validates email addresses. Special characters like *, +, ?, {n,m}, and [^...] define matching rules. Fun fact: the term \"Regular Expression\" was coined by mathematician Stephen Kleene in 1956!",
    ],
}
