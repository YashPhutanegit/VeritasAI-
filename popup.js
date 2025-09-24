const factInput = document.getElementById('factInput');
    const charCount = document.getElementById('charCount');
        const checkButton = document.getElementById('checkButton');
        const loading = document.getElementById('loading');
        const result = document.getElementById('result');
        const quickActions = document.getElementById('quickActions');

        // Character counter
        factInput.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = `${count} / 1000`;
            
            checkButton.disabled = count < 10;
            
            if (count > 900) {
                charCount.style.color = '#ff5050';
            } else if (count > 800) {
                charCount.style.color = '#ffcc00';
            } else {
                charCount.style.color = '#888';
            }
        });

        // Main fact checking function
        checkButton.addEventListener('click', async function() {
            const fact = factInput.value.trim();
            if (!fact || fact.length < 10) return;

            // Show loading state
            checkButton.disabled = true;
            loading.style.display = 'flex';
            result.style.display = 'none';
            quickActions.style.display = 'none';

            try {
                // Simulate API call to your RAG backend
                const response = await checkFact(fact);
                displayResult(response);
            } catch (error) {
                displayError('Unable to verify at this time. Please try again.');
            } finally {
                loading.style.display = 'none';
                checkButton.disabled = false;
            }
        });

        // Simulate fact checking API call
        async function checkFact(fact) {
            // Replace this with actual API call to your RAG backend
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Mock response - replace with actual API integration
                    const mockResponse = generateMockResponse(fact);
                    resolve(mockResponse);
                }, 2000);
            });
        }

        // Generate mock response for demo
        function generateMockResponse(fact) {
            const responses = [
                {
                    status: 'verified',
                    confidence: 92,
                    title: 'Fact Verified',
                    text: 'This statement has been cross-referenced with multiple reliable sources and appears to be accurate.',
                    sources: ['Wikipedia', 'Britannica', 'Scientific American']
                },
                {
                    status: 'unverified',
                    confidence: 15,
                    title: 'Likely False',
                    text: 'Our databases suggest this statement is inaccurate or misleading. Multiple contradictory sources found.',
                    sources: ['Snopes', 'FactCheck.org', 'Reuters Fact Check']
                },
                {
                    status: 'partial',
                    confidence: 68,
                    title: 'Partially Accurate',
                    text: 'This statement contains some truth but lacks important context or has misleading elements.',
                    sources: ['AP News', 'BBC Reality Check']
                }
            ];
            
            return responses[Math.floor(Math.random() * responses.length)];
        }

        // Display verification result
        function displayResult(response) {
            result.className = `result ${response.status}`;
            result.style.display = 'block';
            
            const icons = {
                verified: '✅',
                unverified: '❌', 
                partial: '⚠️'
            };
            
            document.getElementById('resultIcon').textContent = icons[response.status];
            document.getElementById('resultTitle').textContent = response.title;
            document.getElementById('resultText').textContent = response.text;
            
            // Animate confidence bar
            const confidenceFill = document.getElementById('confidenceFill');
            const colors = {
                verified: '#00ffff',
                unverified: '#ff5050',
                partial: '#ffcc00'
            };
            
            confidenceFill.style.backgroundColor = colors[response.status];
            setTimeout(() => {
                confidenceFill.style.width = `${response.confidence}%`;
            }, 100);
            
            // Show sources
            const sourcesDiv = document.getElementById('sources');
            if (response.sources && response.sources.length > 0) {
                sourcesDiv.innerHTML = `Sources: ${response.sources.map(source => 
                    `<a href="#" class="source-link">${source}</a>`
                ).join('')}`;
            }
            
            quickActions.style.display = 'flex';
        }

        function displayError(message) {
            result.className = 'result unverified';
            result.style.display = 'block';
            document.getElementById('resultIcon').textContent = '⚠️';
            document.getElementById('resultTitle').textContent = 'Error';
            document.getElementById('resultText').textContent = message;
        }

        // Quick action functions
        function reportIssue() {
            alert('Report feature would open a feedback form');
        }

        function shareResult() {
            if (navigator.share) {
                navigator.share({
                    title: 'VERITAS AI Verification Result',
                    text: `Fact checked: "${factInput.value.substring(0, 100)}..."`,
                    url: window.location.href
                });
            } else {
                // Fallback for browsers without Web Share API
                navigator.clipboard.writeText(`Verified with VERITAS AI: "${factInput.value}"`);
                alert('Result copied to clipboard!');
            }
        }

        function clearResult() {
            factInput.value = '';
            result.style.display = 'none';
            quickActions.style.display = 'none';
            charCount.textContent = '0 / 1000';
            charCount.style.color = '#888';
            checkButton.disabled = true;
            factInput.focus();
        }

        // Auto-focus on input when popup opens
        factInput.focus();