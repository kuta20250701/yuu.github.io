const ADMIN_PASSWORD = 'yuu2025network';

document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('post-form');
    const productForm = document.getElementById('product-form');
    const fanForm = document.getElementById('fan-form');
    const challengeForm = document.getElementById('challenge-form');
    const postsContainer = document.getElementById('posts');
    const adminPosts = document.getElementById('admin-posts');
    const latestPosts = document.getElementById('latest-posts');
    const popularPosts = document.getElementById('popular-posts');
    const productsContainer = document.getElementById('products');
    const productsManage = document.getElementById('products-manage');
    const challengesContainer = document.getElementById('challenges');
    const challengesManage = document.getElementById('challenges-manage');
    const fanSubmissions = document.getElementById('fan-submissions');
    const searchInput = document.getElementById('search-input');
    const sortMethod = document.getElementById('sort-method');
    const tagsContainer = document.getElementById('tags');
    const loginSection = document.getElementById('login');
    const postSection = document.getElementById('post-section');
    const manageSection = document.getElementById('manage-section');
    const shopManageSection = document.getElementById('shop-manage-section');
    const challengeManageSection = document.getElementById('challenge-manage-section');
    const fanSubmissionManageSection = document.getElementById('fan-submission-manage-section');
    const searchButton = document.getElementById('search-button');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const challenges = JSON.parse(localStorage.getItem('challenges')) || [];
        const fanSubmissionsData = JSON.parse(localStorage.getItem('fanSubmissions')) || [];
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
        const now = new Date();

        const filteredPosts = posts.filter(post => {
            if (post.schedule && new Date(post.schedule) > now) return false;
            return currentPage === 'index' ? true : post.category === currentPage;
        });

        if (postsContainer) {
            postsContainer.innerHTML = '';
            let displayPosts = filteredPosts;
            if (searchInput && searchInput.value) {
                const query = searchInput.value.toLowerCase();
                displayPosts = filteredPosts.filter(post =>
                    post.title.toLowerCase().includes(query) ||
                    post.summary.toLowerCase().includes(query) ||
                    post.tags.some(tag => tag.toLowerCase().includes(query))
                );
                displayPosts.sort((a, b) => {
                    const aScore = (a.title.toLowerCase().includes(query) ? 3 : 0) +
                        (a.summary.toLowerCase().includes(query) ? 2 : 0) +
                        (a.tags.some(tag => tag.toLowerCase().includes(query)) ? 1 : 0);
                    const bScore = (b.title.toLowerCase().includes(query) ? 3 : 0) +
                        (b.summary.toLowerCase().includes(query) ? 2 : 0) +
                        (a.tags.some(tag => tag.toLowerCase().includes(query)) ? 1 : 0);
                    return bScore - aScore;
                });
            } else if (sortMethod && sortMethod.value === 'views') {
                displayPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
            } else {
                displayPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            }

            displayPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.summary}</p>
                    <div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                    <button class="like-btn" onclick="likePost('${post.id}')">${post.liked ? '★' : '☆'}</button> ${post.likes || 0}
                `;
                postElement.addEventListener('click', (e) => {
                    if (e.target.classList.contains('like-btn')) return;
                    post.views = (post.views || 0) + 1;
                    localStorage.setItem('posts', JSON.stringify(posts));
                    postElement.classList.add('full');
                    postElement.innerHTML = `
                        <h3>${post.title}</h3>
                        <div>${post.content}</div>
                        <div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                        <button class="like-btn" onclick="likePost('${post.id}')">${post.liked ? '★' : '☆'}</button> ${post.likes || 0}
                    `;
                });
                postsContainer.appendChild(postElement);
            });
        }

        if (tagsContainer) {
            const allTags = [...new Set([...posts.flatMap(post => post.tags), ...challenges.flatMap(challenge => challenge.tags)])];
            tagsContainer.innerHTML = allTags.map(tag => `<span class="tag" onclick="searchByTag('${tag}')">${tag}</span>`).join('');
        }

        if (latestPosts && popularPosts) {
            latestPosts.innerHTML = '';
            popularPosts.innerHTML = '';
            const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
            sortedPosts.slice(0, 3).forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.summary}</p>
                    <div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                    <button class="like-btn" onclick="likePost('${post.id}')">${post.liked ? '★' : '☆'}</button> ${post.likes || 0}
                `;
                postElement.addEventListener('click', (e) => {
                    if (e.target.classList.contains('like-btn')) return;
                    post.views = (post.views || 0) + 1;
                    localStorage.setItem('posts', JSON.stringify(posts));
                    window.location.href = `${post.category}.html#${post.id}`;
                });
                latestPosts.appendChild(postElement);
            });
            const popular = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
            popular.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.summary}</p>
                    <div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                    <button class="like-btn" onclick="likePost('${post.id}')">${post.liked ? '★' : '☆'}</button> ${post.likes || 0}
                `;
                postElement.addEventListener('click', (e) => {
                    if (e.target.classList.contains('like-btn')) return;
                    post.views = (post.views || 0) + 1;
                    localStorage.setItem('posts', JSON.stringify(posts));
                    window.location.href = `${post.category}.html#${post.id}`;
                });
                popularPosts.appendChild(postElement);
            });
        }

        if (adminPosts) {
            adminPosts.innerHTML = '';
            posts.forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.summary}</p>
                    <div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                    <p>分類: ${post.category} | 時間: ${post.date} | 點閱: ${post.views || 0} | 點讚: ${post.likes || 0}</p>
                    <p>排程: ${post.schedule || '無'}</p>
                    <button onclick="deletePost(${index})">刪除</button>
                `;
                adminPosts.appendChild(postElement);
            });
        }

        if (productsContainer || productsManage) {
            const displayProducts = productsContainer || productsManage;
            displayProducts.innerHTML = '';
            products.forEach((product, index) => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                const discountPrice = product.discount ? (product.price * product.discount).toFixed(0) : product.price;
                productElement.innerHTML = `
                    <h3>${product.name}</h3>
                    ${product.image ? `<img src="${product.image}" alt="${product.name}">` : ''}
                    <p>價格: ${discountPrice} 元 ${product.discount ? `(原價: ${product.price} 元)` : ''}</p>
                    ${productsManage ? `<button onclick="deleteProduct(${index})">刪除</button>` : ''}
                `;
                displayProducts.appendChild(productElement);
            });
        }

        if (challengesContainer) {
            challengesContainer.innerHTML = '';
            let displayChallenges = challenges;
            if (searchInput && searchInput.value) {
                const query = searchInput.value.toLowerCase();
                displayChallenges = challenges.filter(challenge =>
                    challenge.title.toLowerCase().includes(query) ||
                    challenge.description.toLowerCase().includes(query) ||
                    challenge.tags.some(tag => tag.toLowerCase().includes(query))
                );
                displayChallenges.sort((a, b) => {
                    const aScore = (a.title.toLowerCase().includes(query) ? 3 : 0) +
                        (a.description.toLowerCase().includes(query) ? 2 : 0) +
                        (a.tags.some(tag => tag.toLowerCase().includes(query)) ? 1 : 0);
                    const bScore = (b.title.toLowerCase().includes(query) ? 3 : 0) +
                        (b.description.toLowerCase().includes(query) ? 2 : 0) +
                        (a.tags.some(tag => tag.toLowerCase().includes(query)) ? 1 : 0);
                    return bScore - aScore;
                });
            } else if (sortMethod && sortMethod.value === 'progress') {
                displayChallenges.sort((a, b) => (b.progress || 0) - (a.progress || 0));
            } else {
                displayChallenges.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            }

            displayChallenges.forEach(challenge => {
                const challengeElement = document.createElement('div');
                challengeElement.classList.add('challenge');
                const progress = challenge.progress || 0;
                const totalDays = challenge.totalDays || 50;
                challengeElement.innerHTML = `
                    <h3>${challenge.title}</h3>
                    <p>${challenge.description}</p>
                    <p>規則: ${challenge.rules.join(', ')}</p>
                    <p>進度: ${progress}/${totalDays} 天</p>
                    <div class="tags">${challenge.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                    ${challenge.image ? `<img src="${challenge.image}" alt="${challenge.title}">` : ''}
                    ${challenge.audio ? `<audio controls src="${challenge.audio}"></audio>` : ''}
                    <button class="like-btn" onclick="likeChallenge('${challenge.id}')">${challenge.liked ? '★' : '☆'}</button> ${challenge.likes || 0}
                `;
                challengeElement.addEventListener('click', (e) => {
                    if (e.target.classList.contains('like-btn')) return;
                    challenge.views = (challenge.views || 0) + 1;
                    localStorage.setItem('challenges', JSON.stringify(challenges));
                    challengeElement.classList.add('full');
                    challengeElement.innerHTML = `
                        <h3>${challenge.title}</h3>
                        <p>${challenge.description}</p>
                        <p>規則: ${challenge.rules.join(', ')}</p>
                        <p>進度: ${progress}/${totalDays} 天</p>
                        <div>${challenge.updates.map(update => `<p>${update.date}: ${update.note}</p>`).join('')}</div>
                        ${challenge.image ? `<img src="${challenge.image}" alt="${challenge.title}">` : ''}
                        ${challenge.audio ? `<audio controls src="${challenge.audio}"></audio>` : ''}
                        <div class="tags">${challenge.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                        <button class="like-btn" onclick="likeChallenge('${challenge.id}')">${challenge.liked ? '★' : '☆'}</button> ${challenge.likes || 0}
                    `;
                });
                challengesContainer.appendChild(challengeElement);
            });
        }

        if (challengesManage) {
            challengesManage.innerHTML = '';
            challenges.forEach((challenge, index) => {
                const challengeElement = document.createElement('div');
                challengeElement.classList.add('challenge');
                challengeElement.innerHTML = `
                    <h3>${challenge.title}</h3>
                    <p>${challenge.description}</p>
                    <p>規則: ${challenge.rules.join(', ')}</p>
                    <p>進度: ${challenge.progress || 0}/${challenge.totalDays} 天</p>
                    <div class="tags">${challenge.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                    <p>開始日期: ${challenge.startDate}</p>
                    <p>點閱: ${challenge.views || 0} | 點讚: ${challenge.likes || 0}</p>
                    <button onclick="deleteChallenge(${index})">刪除</button>
                `;
                challengesManage.appendChild(challengeElement);
            });
        }

        if (fanSubmissions) {
            fanSubmissions.innerHTML = '';
            fanSubmissionsData.forEach((submission, index) => {
                const submissionElement = document.createElement('div');
                submissionElement.classList.add('post'); // 使用 .post 樣式，保持一致
                submissionElement.innerHTML = `
                    <h3>${submission.name} 的投稿</h3>
                    <p>Email: ${submission.email}</p>
                    <p>分類: ${submission.category}</p>
                    <p>內容: ${submission.content}</p>
                    <p>提交時間: ${submission.date}</p>
                    <button onclick="deleteFanSubmission(${index})">刪除</button>
                `;
                fanSubmissions.appendChild(submissionElement);
            });
        }
    }

    if (postForm) {
        postForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const category = document.getElementById('post-category').value;
            const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
            const title = document.getElementById('post-title').value;
            const summary = document.getElementById('post-summary').value;
            let content = document.getElementById('post-content').value;
            const image = document.getElementById('post-image').files[0];
            const audio = document.getElementById('post-audio').files[0];
            const schedule = document.getElementById('schedule-date').value;
            const posts = JSON.parse(localStorage.getItem('posts')) || [];

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

            function savePost() {
                const post = {
                    id: Date.now().toString(),
                    category,
                    tags,
                    title,
                    summary,
                    content,
                    date: new Date().toLocaleString('zh-TW'),
                    schedule: schedule || null,
                    views: 0,
                    likes: 0,
                    liked: false
                };
                posts.push(post);
                localStorage.setItem('posts', JSON.stringify(posts));
                postForm.reset();
                loadPosts();
            }
        });
    }

    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('product-name').value;
            const price = parseFloat(document.getElementById('product-price').value);
            const discount = document.getElementById('product-discount').value || null;
            const image = document.getElementById('product-image').files[0];
            const products = JSON.parse(localStorage.getItem('products')) || [];

            if (image) {
                const reader = new FileReader();
                reader.onload = () => {
                    products.push({ name, price, discount, image: reader.result });
                    localStorage.setItem('products', JSON.stringify(products));
                    productForm.reset();
                    loadPosts();
                };
                reader.readAsDataURL(image);
            } else {
                products.push({ name, price, discount });
                localStorage.setItem('products', JSON.stringify(products));
                productForm.reset();
                loadPosts();
            }
        });
    }

    if (fanForm) {
        fanForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fan-name').value;
            const email = document.getElementById('fan-email').value;
            const category = document.getElementById('fan-category').value;
            const content = document.getElementById('fan-content').value;
            const fanSubmissionsData = JSON.parse(localStorage.getItem('fanSubmissions')) || [];

            const submission = {
                id: Date.now().toString(),
                name,
                email,
                category,
                content,
                date: new Date().toLocaleString('zh-TW')
            };
            fanSubmissionsData.push(submission);
            localStorage.setItem('fanSubmissions', JSON.stringify(fanSubmissionsData));

            const subject = `粉絲投稿 - ${category}`;
            const body = `姓名: ${name}\nEmail: ${email}\n分類: ${category}\n內容: ${content}`;
            window.location.href = `mailto:yuunet.07@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            fanForm.reset();
            loadPosts();
        });
    }

    if (challengeForm) {
        challengeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('challenge-title').value;
            const description = document.getElementById('challenge-description').value;
            const rules = document.getElementById('challenge-rules').value.split(',').map(rule => rule.trim()).filter(rule => rule);
            const tags = document.getElementById('challenge-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
            const totalDays = parseInt(document.getElementById('challenge-total-days').value);
            const image = document.getElementById('challenge-image').files[0];
            const audio = document.getElementById('challenge-audio').files[0];
            const challenges = JSON.parse(localStorage.getItem('challenges')) || [];

            if (image) {
                const reader = new FileReader();
                reader.onload = () => {
                    saveChallenge(reader.result, null);
                };
                reader.readAsDataURL(image);
            } else if (audio) {
                const reader = new FileReader();
                reader.onload = () => {
                    saveChallenge(null, reader.result);
                };
                reader.readAsDataURL(audio);
            } else {
                saveChallenge(null, null);
            }

            function saveChallenge(image, audio) {
                const challenge = {
                    id: Date.now().toString(),
                    title,
                    description,
                    rules,
                    tags,
                    totalDays,
                    progress: 0,
                    startDate: new Date().toLocaleString('zh-TW'),
                    updates: [],
                    image,
                    audio,
                    views: 0,
                    likes: 0,
                    liked: false
                };
                challenges.push(challenge);
                localStorage.setItem('challenges', JSON.stringify(challenges));
                challengeForm.reset();
                loadPosts();
            }
        });
    }

    window.login = (event) => {
        event.preventDefault();
        const password = document.getElementById('password').value;
        if (password === ADMIN_PASSWORD) {
            loginSection.classList.add('hidden');
            postSection.classList.remove('hidden');
            manageSection.classList.remove('hidden');
            shopManageSection.classList.remove('hidden');
            challengeManageSection.classList.remove('hidden');
            fanSubmissionManageSection.classList.remove('hidden');
            loadPosts();
            document.getElementById('password').value = '';
        } else {
            alert('密碼錯誤，請重新輸入');
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    };

    window.deletePost = (index) => {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.splice(index, 1);
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    };

    window.deleteProduct = (index) => {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        loadPosts();
    };

    window.deleteChallenge = (index) => {
        const challenges = JSON.parse(localStorage.getItem('challenges')) || [];
        challenges.splice(index, 1);
        localStorage.setItem('challenges', JSON.stringify(challenges));
        loadPosts();
    };

    window.deleteFanSubmission = (index) => {
        const fanSubmissionsData = JSON.parse(localStorage.getItem('fanSubmissions')) || [];
        fanSubmissionsData.splice(index, 1);
        localStorage.setItem('fanSubmissions', JSON.stringify(fanSubmissionsData));
        loadPosts();
    };

    window.likePost = (id) => {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const post = posts.find(p => p.id === id);
        if (post) {
            post.liked = !post.liked;
            post.likes = (post.likes || 0) + (post.liked ? 1 : -1);
            localStorage.setItem('posts', JSON.stringify(posts));
            loadPosts();
        }
    };

    window.likeChallenge = (id) => {
        const challenges = JSON.parse(localStorage.getItem('challenges')) || [];
        const challenge = challenges.find(c => c.id === id);
        if (challenge) {
            challenge.liked = !challenge.liked;
            challenge.likes = (challenge.likes || 0) + (challenge.liked ? 1 : -1);
            localStorage.setItem('challenges', JSON.stringify(challenges));
            loadPosts();
        }
    };

    window.searchByTag = (tag) => {
        if (searchInput) {
            searchInput.value = tag;
            loadPosts();
        }
    };

    if (searchInput) searchInput.addEventListener('input', loadPosts);
    if (sortMethod) sortMethod.addEventListener('change', loadPosts);
    if (searchButton) searchButton.addEventListener('click', loadPosts);

    if (window.location.hash) {
        const id = window.location.hash.substring(1);
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const challenges = JSON.parse(localStorage.getItem('challenges')) || [];
        const post = posts.find(p => p.id === id);
        const challenge = challenges.find(c => c.id === id);
        if (post && postsContainer) {
            postsContainer.innerHTML = '';
            const postElement = document.createElement('div');
            postElement.classList.add('post', 'full');
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <div>${post.content}</div>
                <div class="tags">${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                <button class="like-btn" onclick="likePost('${post.id}')">${post.liked ? '★' : '☆'}</button> ${post.likes || 0}
            `;
            postsContainer.appendChild(postElement);
        } else if (challenge && challengesContainer) {
            challengesContainer.innerHTML = '';
            const challengeElement = document.createElement('div');
            challengeElement.classList.add('challenge', 'full');
            challengeElement.innerHTML = `
                <h3>${challenge.title}</h3>
                <p>${challenge.description}</p>
                <p>規則: ${challenge.rules.join(', ')}</p>
                <p>進度: ${challenge.progress || 0}/${challenge.totalDays} 天</p>
                <div>${challenge.updates.map(update => `<p>${update.date}: ${update.note}</p>`).join('')}</div>
                ${challenge.image ? `<img src="${challenge.image}" alt="${challenge.title}">` : ''}
                ${challenge.audio ? `<audio controls src="${challenge.audio}"></audio>` : ''}
                <div class="tags">${challenge.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
                <button class="like-btn" onclick="likeChallenge('${challenge.id}')">${challenge.liked ? '★' : '☆'}</button> ${challenge.likes || 0}
            `;
            challengesContainer.appendChild(challengeElement);
        }
    }

    loadPosts();
});