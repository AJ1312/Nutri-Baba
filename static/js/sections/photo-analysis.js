class PhotoAnalysis {
    constructor(mainApp) {
        this.app = mainApp;
        this.isInitialized = false;
        this.currentImage = null;
    }

    async onSectionShow() {
        if (!this.isInitialized) {
            await this.initialize();
            this.isInitialized = true;
        }
    }

    async initialize() {
        this.setupFileUpload();
        this.setupDragDrop();
    }

    setupFileUpload() {
        const fileInput = document.getElementById('file-input');
        const uploadBtn = document.getElementById('upload-btn');
        const newAnalysisBtn = document.getElementById('new-analysis');

        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        if (newAnalysisBtn) {
            newAnalysisBtn.addEventListener('click', () => this.resetAnalysis());
        }
    }

    setupDragDrop() {
        const uploadArea = document.getElementById('upload-area');
        if (!uploadArea) return;

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        });
    }

    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            await this.processFile(file);
        }
    }

    async processFile(file) {
        if (!file.type.startsWith('image/')) {
            this.app.showToast('Please select an image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.app.showToast('Image file is too large. Please select a file smaller than 5MB.', 'error');
            return;
        }

        this.currentImage = file;
        await this.analyzeImage(file);
    }

    async analyzeImage(file) {
        try {
            this.app.setLoading(true);

            // Display the image
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewImg = document.getElementById('preview-image');
                if (previewImg) {
                    previewImg.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);

            // Simulate analysis - in real app, send to Flask backend
            const formData = new FormData();
            formData.append('image', file);

            const result = await this.app.apiCall('/api/scan-food', {
                method: 'POST',
                body: formData,
                headers: {} // Remove Content-Type to let browser set it for FormData
            });

            if (result.success) {
                this.displayAnalysisResult(result.food_info);
            } else {
                throw new Error(result.message || 'Analysis failed');
            }

        } catch (error) {
            console.error('Image analysis error:', error);
            this.app.showToast('Failed to analyze image. Please try again.', 'error');
        } finally {
            this.app.setLoading(false);
        }
    }

    displayAnalysisResult(foodInfo) {
        const uploadArea = document.getElementById('upload-area');
        const analysisResult = document.getElementById('analysis-result');
        const foodNameEl = document.getElementById('food-name');
        const nutritionGrid = document.getElementById('nutrition-grid');
        const confidenceEl = document.getElementById('confidence-score');

        if (uploadArea) uploadArea.style.display = 'none';
        if (analysisResult) analysisResult.style.display = 'block';
        if (foodNameEl) foodNameEl.textContent = foodInfo.name || 'Unknown Food';
        if (confidenceEl) confidenceEl.textContent = '95%'; // Mock confidence

        if (nutritionGrid) {
            nutritionGrid.innerHTML = `
                <div class="nutrition-item">
                    <span class="label">Calories</span>
                    <span class="value">${foodInfo.calories || 0}</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Protein</span>
                    <span class="value">${foodInfo.protein || 0}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Carbs</span>
                    <span class="value">${foodInfo.carbs || 0}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Fat</span>
                    <span class="value">${foodInfo.fat || 0}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Fiber</span>
                    <span class="value">${foodInfo.fiber || 0}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Sugar</span>
                    <span class="value">${foodInfo.sugar || 0}g</span>
                </div>
            `;
        }

        // Setup add to diary button
        const addToDiaryBtn = document.getElementById('add-to-diary');
        if (addToDiaryBtn) {
            addToDiaryBtn.onclick = () => this.addToDiary(foodInfo);
        }
    }

    async addToDiary(foodInfo) {
        try {
            // In real app, this would save to user's food diary
            this.app.showToast(`${foodInfo.name} added to your diary!`, 'success');
            // Optionally switch to a food diary section
        } catch (error) {
            this.app.showToast('Failed to add to diary', 'error');
        }
    }

    resetAnalysis() {
        const uploadArea = document.getElementById('upload-area');
        const analysisResult = document.getElementById('analysis-result');
        const fileInput = document.getElementById('file-input');

        if (uploadArea) uploadArea.style.display = 'block';
        if (analysisResult) analysisResult.style.display = 'none';
        if (fileInput) fileInput.value = '';

        this.currentImage = null;
    }
}

window.PhotoAnalysis = PhotoAnalysis;
