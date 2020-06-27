class Quiz {
	constructor(data = testData, settings, i18n) {
		this.data = data;
		this.currentQuestion = 0;
		this.settings = {
			...{
				container: 'quiz-container',
				length: this.data.length > 10 ? 10 : this.data.length,
				shuffle: false,
				tryAgain: true
			},
			...settings
		};
		this.i18n = {
			...{ nextBtn: 'Next', endBtn: 'End' },
			...i18n
		};
		this.score = 0;
		this.totalScore = this.settings.length;
		this.init();
	}
	shuffle(data) {
		for (let i = data.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[data[i], data[j]] = [data[j], data[i]];
		}
		return data;
	}
	init() {
		// Shuffle answers
		for (let i = 0; i < this.data.length; i++)
			this.data.answers = this.shuffle(this.data[i].answers);
		// Shuffle data if needed
		this.data =
			this.settings.shuffle === true ? this.shuffle(this.data) : this.data;

		this.clearContainer();
		this.showCard(this.data[this.currentQuestion]);
	}
	clearContainer() {
		this.currentQuestion = 0;
		document.getElementById(this.settings.container).innerHTML = '';
	}
	endGame() {
		this.clearContainer();
		const parent = document.getElementById(this.settings.container);

		const h2 = document.createElement('h1');
		h2.innerHTML = `${this.score*5} баллов из ${this.totalScore*5}`;

		parent.appendChild(h2);
		parent.appendChild(img);
		if (this.settings.tryAgain) {
			const tryAgainBtn = document.createElement('button');
			tryAgainBtn.innerHTML = 'Еще раз';
			tryAgainBtn.style.marginBottom = '1rem';
			tryAgainBtn.onclick = () => this.init();
			parent.appendChild(tryAgainBtn);
		}
		parent.appendChild(vkShareBtn);
	}
	generateAnswers(question, container) {
		container.innerHTML = '';

		function passAnswer(input) {
			if (input.checked) {
				input.parentElement.classList.add('checked');
			} else {
				input.parentElement.classList.remove('checked');
			}
			if (input.type === 'radio' && input.checked) {
				this.score += Number(input.value);
				if (this.currentQuestion < this.settings.length - 1)
					this.showCard(this.data[(this.currentQuestion += 1)]);
				else this.endGame();
			} else {
				const btn = document.createElement('button');
				btn.innerHTML =
					this.currentQuestion === this.settings.length - 1
						? this.i18n.endBtn
						: this.i18n.nextBtn;
				btn.onclick = () => {
					const multiScore = [...container.querySelectorAll('input:checked')]
						.map(inp => Number(inp.value))
						.reduce((a, c) => a + c);
					this.score += multiScore;
					this.currentQuestion === this.settings.length - 1
						? this.endGame()
						: this.showCard(this.data[(this.currentQuestion += 1)]);
				};
				if (!container.querySelector('button')) container.appendChild(btn);
			}
		}
		passAnswer = passAnswer.bind(this);

		const answers = question.answers;
		const multipleChoice =
			answers.filter(answer => answer.score > 0).length > 1;

		for (let i = 0; i < answers.length; i++) {
			const answerForm = document.createElement('input');
			answerForm.type = multipleChoice ? 'checkbox' : 'radio';
			answerForm.name = 'answer';
			answerForm.value = answers[i].score;
			answerForm.onclick = () => setTimeout(() => passAnswer(answerForm), 300);
			const answerLabel = document.createElement('label');
			answerLabel.innerHTML = answers[i].answer;
			answerLabel.appendChild(answerForm);
			container.appendChild(answerLabel);
		}
	}
	showCard(question) {
		const parent = document.getElementById(this.settings.container);
		const isChildNotExist = parent.querySelector('#quiz-card') === null;

		const child = isChildNotExist
			? document.createElement('div')
			: document.querySelector('#quiz-card');

		const pageFromTotal = isChildNotExist
			? document.createElement('p')
			: child.querySelector('p');
		pageFromTotal.style.textAlign = 'center';
		pageFromTotal.style.marginBottom = '1rem';
		pageFromTotal.innerHTML = `${this.currentQuestion + 1}/${
			this.settings.length
		}`;

		const questionText = isChildNotExist
			? document.createElement('h3')
			: child.querySelector('h3');
		questionText.innerHTML = question.question;

		const answersContainer = isChildNotExist
			? document.createElement('div')
			: child.querySelector('div');

		this.generateAnswers(this.data[this.currentQuestion], answersContainer);

		if (isChildNotExist) {
			child.id = 'quiz-card';
			child.appendChild(pageFromTotal);
			child.appendChild(questionText);
			child.appendChild(answersContainer);
			parent.appendChild(child);
		}
	}
}
