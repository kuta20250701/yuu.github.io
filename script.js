document.addEventListener('DOMContentLoaded', () => {
    // 初始化導覽列
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('nav ul');
    if (hamburger && navUl) {
        hamburger.addEventListener('click', () => {
            navUl.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // 初始化各頁面內容
    loadPosts();
    loadProducts();
    loadChallenges();
    loadFanSubmissions();
});

// 後台登入
function login(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    if (password === 'yuu2025network') {
        document.getElementById('login')?.classList.add('hidden');
        document.getElementById('post-section')?.classList.remove('hidden');
        document.getElementById('manage-section')?.classList.remove('hidden');
        document.getElementById('shop-manage-section')?.classList.remove('hidden');
        document.getElementById('challenge-manage-section')?.classList.remove('hidden');
        document.getElementById('fan-submission-manage-section')?.classList.remove('hidden');
    } else {
        alert('密碼錯誤，請重新輸入');
    }
}

// 文章管理
function addPost(event) {
    event.preventDefault();
    const category = document.getElementById('post-category').value;
    const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim());
    const title = document.getElementById('post-title').value;
    const summary = document.getElementById('post-summary').value;
    let content = document.getElementById('post-content').value;
    const image = document.getElementById('post-image').files[0];
    const audio = document.getElementById('post-audio').files[0];
    const schedule = document.getElementById('schedule-date').value;
    const date = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

    const savePost = () => {
        const post = {
            id: Date.now().toString(),
            category,
            tags,
            title,
            summary,
            content,
            date,
            schedule: schedule || null,
            views: 0,
            likes: 0,
            liked: false
        };
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
        document.getElementById('post-form').reset();
        loadPosts();
    };

    if (image) {
        const reader = new FileReader();
        reader.onload = () => {
            content = `<img src="${reader.result}" alt="Post Image">${content}`;
            savePost();
        };
        reader.readAsDataURL(image);
    } else if (audio) {
        const reader = new FileReader();
        reader.onload = () => {
            content = `<audio controls src="${reader.result}"></audio>${content}`;
            savePost();
        };
        reader.readAsDataURL(audio);
    } else {
        savePost();
    }
}

function loadPosts() {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    const adminContainer = document.getElementById('admin-posts');
    const blogContainer = document.getElementById('posts');
    const latestPosts = document.getElementById('latest-posts');
    const popularPosts = document.getElementById('popular-posts');

    if (adminContainer) {
        adminContainer.innerHTML = '';
        posts.forEach((post, index) => {
            if (!post.schedule || new Date(post.schedule) <= new Date()) {
                let div = document.createElement('div');
                div.className = 'post';
                div.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.summary}</p>
                    <p>分類: ${post.category}</p>
                    <p>標籤: ${post.tags.join(', ')}</p>
                    <p>發文時間: ${post.date}</p>
                    <button onclick="deletePost(${index})">刪除</button>
                `;
                adminContainer.appendChild(div);
            }
        });
    }

    if (blogContainer) {
        blogContainer.innerHTML = '';
        posts.filter(post => !post.schedule || new Date(post.schedule) <= new Date())
             .filter(post => post.category === document.body.id)
             .forEach(post => {
                 let div = document.createElement('div');
                 div.className = 'post';
                 div.innerHTML = `
                     <h3>${post.title}</h3>
                     <p>${post.summary}</p>
                     <div>${post.content}</div>
                     <p>標籤: ${post.tags.join(', ')}</p>
                     <p>發文時間: ${post.date}</p>
                     <p>瀏覽量: ${post.views}</p>
                     <button class="like-btn" onclick="likePost('${post.id}')">${post.liked ? '❤️' : '🤍'} ${post.likes}</button>
                 `;
                 blogContainer.appendChild(div);
             });
    }

    if (latestPosts) {
        latestPosts.innerHTML = '';
        posts.sort((a, b) => new Date(b.date) - new Date(a.date))
             .slice(0, 3)
             .forEach(post => {
                 let div = document.createElement('div');
                 div.className = 'post';
                 div.innerHTML = `<h3>${post.title}</h3><p>${post.summary}</p>`;
                 latestPosts.appendChild(div);
             });
    }

    if (popularPosts) {
        popularPosts.innerHTML = '';
        posts.sort((a, b) => b.views - a.views)
             .slice(0, 3)
             .forEach(post => {
                 let div = document.createElement('div');
                 div.className = 'post';
                 div.innerHTML = `<h3>${post.title}</h3><p>${post.summary}</p>`;
                 popularPosts.appendChild(div);
             });
    }
}

function deletePost(index) {
    if (confirm('確定要刪除此文章？')) {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.splice(index, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    }
}

function likePost(postId) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    }
}

// 商店管理
function addProduct(event) {
    event.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const discount = document.getElementById('product-discount').value ? parseFloat(document.getElementById('product-discount').value) : null;
    const description = document.getElementById('product-description').value;
    const condition = parseInt(document.getElementById('product-condition').value);
    const image = document.getElementById('product-image').files[0];

    if (image) {
        const reader = new FileReader();
        reader.onload = () => {
            const product = { name, price, discount, description, condition, image: reader.result };
            saveProduct(product);
            document.getElementById('product-form').reset();
        };
        reader.readAsDataURL(image);
    } else {
        const product = { name, price, discount, description, condition, image: null };
        saveProduct(product);
        document.getElementById('product-form').reset();
    }
}

function saveProduct(product) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
}

function loadProducts() {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const adminContainer = document.getElementById('products-manage');
    const shopContainer = document.getElementById('products');

    if (adminContainer) {
        adminContainer.innerHTML = '';
        products.forEach((product, index) => {
            let div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
                <h3>${product.name}</h3>
                <p>價格: ${product.price}元 ${product.discount ? `(折扣: ${product.discount})` : ''}</p>
                <p>商品說明: ${product.description || '無說明'}</p>
                <p class="condition">損壞程度: ${renderCondition(product.condition)}</p>
                ${product.image ? `<img src="${product.image}" alt="${product.name}">` : ''}
                <button onclick="deleteProduct(${index})">刪除</button>
            `;
            adminContainer.appendChild(div);
        });
    }

    if (shopContainer) {
        shopContainer.innerHTML = '';
        products.forEach(product => {
            let div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
                <h3>${product.name}</h3>
                <p>價格: ${product.price}元 ${product.discount ? `(折扣: ${product.discount})` : ''}</p>
                <p>商品說明: ${product.description || '無說明'}</p>
                <p class="condition">損壞程度: ${renderCondition(product.condition)}</p>
                ${product.image ? `<img src="${product.image}" alt="${product.name}">` : ''}
            `;
            shopContainer.appendChild(div);
        });
    }
}

function renderCondition(condition) {
    const stars = '★★★★★';
    return condition ? stars.slice(0, condition) + '☆☆☆☆☆'.slice(condition) : '無評分';
}

function deleteProduct(index) {
    if (confirm('確定要刪除此商品？')) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
    }
}

// 挑戰管理
function addChallenge(event) {
    event.preventDefault();
    const title = document.getElementById('challenge-title').value;
    const description = document.getElementById('challenge-description').value;
    const rules = document.getElementById('challenge-rules').value.split(',').map(rule => rule.trim());
    const tags = document.getElementById('challenge-tags').value.split(',').map(tag => tag.trim());
    const totalDays = parseInt(document.getElementById('challenge-total-days').value);
    const image = document.getElementById('challenge-image').files[0];
    const audio = document.getElementById('challenge-audio').files[0];

    const saveChallenge = (content) => {
        const challenge = {
            id: Date.now().toString(),
            title,
            description: content,
            rules,
            tags,
            totalDays,
            date: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
        };
        let challenges = JSON.parse(localStorage.getItem('challenges')) || [];
        challenges.push(challenge);
        localStorage.setItem('challenges', JSON.stringify(challenges));
        document.getElementById('challenge-form').reset();
        loadChallenges();
    };

    if (image) {
        const reader = new FileReader();
        reader.onload = () => {
            saveChallenge(`<img src="${reader.result}" alt="Challenge Image">${description}`);
        };
        reader.readAsDataURL(image);
    } else if (audio) {
        const reader = new FileReader();
        reader.onload = () => {
            saveChallenge(`<audio controls src="${reader.result}"></audio>${description}`);
        };
        reader.readAsDataURL(audio);
    } else {
        saveChallenge(description);
    }
}

function loadChallenges() {
    let challenges = JSON.parse(localStorage.getItem('challenges')) || [];
    const adminContainer = document.getElementById('challenges-manage');
    const challengeContainer = document.getElementById('challenges');

    if (adminContainer) {
        adminContainer.innerHTML = '';
        challenges.forEach((challenge, index) => {
            let div = document.createElement('div');
            div.className = 'challenge';
            div.innerHTML = `
                <h3>${challenge.title}</h3>
                <p>${challenge.description}</p>
                <p>規則: ${challenge.rules.join(', ')}</p>
                <p>標籤: ${challenge.tags.join(', ')}</p>
                <p>總天數: ${challenge.totalDays}</p>
                <p>發佈時間: ${challenge.date}</p>
                <button onclick="deleteChallenge(${index})">刪除</button>
            `;
            adminContainer.appendChild(div);
        });
    }

    if (challengeContainer) {
        challengeContainer.innerHTML = '';
        challenges.forEach(challenge => {
            let div = document.createElement('div');
            div.className = 'challenge';
            div.innerHTML = `
                <h3>${challenge.title}</h3>
                <p>${challenge.description}</p>
                <p>規則: ${challenge.rules.join(', ')}</p>
                <p>標籤: ${challenge.tags.join(', ')}</p>
                <p>總天數: ${challenge.totalDays}</p>
            `;
            challengeContainer.appendChild(div);
        });
    }
}

function deleteChallenge(index) {
    if (confirm('確定要刪除此挑戰？')) {
        let challenges = JSON.parse(localStorage.getItem('challenges')) || [];
        challenges.splice(index, 1);
        localStorage.setItem('challenges', JSON.stringify(challenges));
        loadChallenges();
    }
}

// 粉絲投稿管理
function addFanSubmission(event) {
    event.preventDefault();
    const title = document.getElementById('fan-submission-title').value;
    const content = document.getElementById('fan-submission-content').value;
    const image = document.getElementById('fan-submission-image').files[0];

    const saveSubmission = (imageData) => {
        const submission = {
            id: Date.now().toString(),
            title,
            content: imageData ? `<img src="${imageData}" alt="Fan Submission">${content}` : content,
            date: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
            approved: false
        };
        let submissions = JSON.parse(localStorage.getItem('fanSubmissions')) || [];
        submissions.push(submission);
        localStorage.setItem('fanSubmissions', JSON.stringify(submissions));
        document.getElementById('fan-submission-form').reset();
        loadFanSubmissions();
    };

    if (image) {
        const reader = new FileReader();
        reader.onload = () => saveSubmission(reader.result);
        reader.readAsDataURL(image);
    } else {
        saveSubmission(null);
    }
}

function loadFanSubmissions() {
    let submissions = JSON.parse(localStorage.getItem('fanSubmissions')) || [];
    const adminContainer = document.getElementById('fan-submissions');
    const submissionContainer = document.getElementById('fan-submissions-display');

    if (adminContainer) {
        adminContainer.innerHTML = '';
        submissions.forEach((submission, index) => {
            let div = document.createElement('div');
            div.className = 'submission';
            div.innerHTML = `
                <h3>${submission.title}</h3>
                <p>${submission.content}</p>
                <p>提交時間: ${submission.date}</p>
                <p>狀態: ${submission.approved ? '已通過' : '待審核'}</p>
                <button onclick="approveSubmission(${index})">${submission.approved ? '取消通過' : '通過'}</button>
                <button onclick="deleteSubmission(${index})">刪除</button>
            `;
            adminContainer.appendChild(div);
        });
    }

    if (submissionContainer) {
        submissionContainer.innerHTML = '';
        submissions.filter(s => s.approved).forEach(submission => {
            let div = document.createElement('div');
            div.className = 'submission';
            div.innerHTML = `
                <h3>${submission.title}</h3>
                <p>${submission.content}</p>
                <p>提交時間: ${submission.date}</p>
            `;
            submissionContainer.appendChild(div);
        });
    }
}

function approveSubmission(index) {
    let submissions = JSON.parse(localStorage.getItem('fanSubmissions')) || [];
    submissions[index].approved = !submissions[index].approved;
    localStorage.setItem('fanSubmissions', JSON.stringify(submissions));
    loadFanSubmissions();
}

function deleteSubmission(index) {
    if (confirm('確定要刪除此投稿？')) {
        let submissions = JSON.parse(localStorage.getItem('fanSubmissions')) || [];
        submissions.splice(index, 1);
        localStorage.setItem('fanSubmissions', JSON.stringify(submissions));
        loadFanSubmissions();
    }
}