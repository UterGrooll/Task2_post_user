document.addEventListener('DOMContentLoaded', () => {
    const allPostsBtn = document.getElementById('tab-all');
    const byAuthorBtn = document.getElementById('tab-authors');
    const authorListContainer = document.getElementById('author-list');
    const outputContainer = document.getElementById('output');

    let users = [];

    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(data => {
            users = data;
            renderAuthors();
        });

    function loadAllPosts() {
        outputContainer.innerHTML = '';
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(posts => {
                const postsWithUserNames = posts.map(post => {
                    const user = users.find(u => u.id === post.userId);
                    return {
                        ...post,
                        userName: user ? user.name : 'Неизвестный автор'
                    };
                });
                displayPosts(postsWithUserNames);
            });
    }

    function displayPosts(posts) {
        outputContainer.innerHTML = '';
        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card';

            const header = document.createElement('div');
            header.className = 'card-header';
            header.textContent = `Автор: ${post.userName}`;

            const title = document.createElement('div');
            title.className = 'card-title';
            title.textContent = post.title;

            const body = document.createElement('div');
            body.className = 'card-body';
            body.textContent = post.body;

            card.appendChild(header);
            card.appendChild(title);
            card.appendChild(body);

            outputContainer.appendChild(card);
        });
    }

    function renderAuthors() {
        authorListContainer.innerHTML = '';
        users.forEach(user => {
            const btn = document.createElement('button');
            btn.textContent = user.name;
            btn.className = 'author-button';
            btn.addEventListener('click', () => loadPostsByAuthor(user.id));
            authorListContainer.appendChild(btn);
        });
    }

    function loadPostsByAuthor(userId) {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(posts => {
                const filtered = posts.filter(post => post.userId === userId);
                const user = users.find(u => u.id === userId);
                const postsWithUserName = filtered.map(post => ({
                    ...post,
                    userName: user.name
                }));
                displayPosts(postsWithUserName);
            });
    }

    allPostsBtn.addEventListener('click', () => {
        authorListContainer.classList.add('hidden');
        loadAllPosts();
    });

    byAuthorBtn.addEventListener('click', () => {
        authorListContainer.classList.remove('hidden');
        outputContainer.innerHTML = '<p>Выберите автора выше, чтобы увидеть посты.</p>';
    });

    loadAllPosts();
});
