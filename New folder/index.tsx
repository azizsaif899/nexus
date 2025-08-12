/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, Chat } from "@google/genai";

declare global {
    interface Window {
      SpeechRecognition: any;
      webkitSpeechRecognition: any;
    }
    interface SpeechRecognitionEvent extends Event {
        results: any;
    }
    interface SpeechRecognitionErrorEvent extends Event {
        error: string;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // --- API KEY CHECK ---
    const messageList = document.getElementById('message-list') as HTMLElement;

    if (!process.env.API_KEY) {
        console.error("API_KEY not found. Please ensure the API_KEY environment variable is set.");
        if (messageList) {
            messageList.innerHTML = `<div class="message ai-message"><p style="color: var(--theme-secondary-accent);">خطأ في الإعداد: مفتاح API غير موجود. يرجى التأكد من تعيين متغير البيئة API_KEY.</p></div>`;
        }
        // Disable form if API key is missing
        const chatForm = document.getElementById('chat-form') as HTMLFormElement;
        if(chatForm) chatForm.style.display = 'none';
        return; 
    }

    // --- THEME SWITCHER LOGIC ---
    const themeMenuBtn = document.getElementById('themeMenuBtn');
    const themeMenu = document.getElementById('themeMenu');
    const themeOptions = document.querySelectorAll('.theme-option');
    const personaOptions = document.querySelectorAll('.persona-option');
    const THEME_KEY = 'nexusChatTheme';
    const PERSONA_KEY = 'nexusChatPersona';

    function applyTheme(theme: string) {
        document.body.setAttribute('data-theme', theme);
        themeOptions.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
        });
    }

    function saveTheme(theme: string) {
        localStorage.setItem(THEME_KEY, theme);
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY) || 'matrix';
        applyTheme(savedTheme);
    }

    if (themeMenuBtn && themeMenu) {
        themeMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!themeMenu.contains(e.target as Node) && !themeMenuBtn.contains(e.target as Node)) {
                themeMenu.classList.remove('active');
            }
        });

        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedTheme = option.getAttribute('data-theme');
                if (selectedTheme) {
                    applyTheme(selectedTheme);
                    saveTheme(selectedTheme);
                    themeMenu.classList.remove('active');
                }
            });
        });
    }

    loadTheme(); // Load the theme on initial page load


    // --- ADVANCED THEME AND INTERACTIVITY SCRIPT ---

    /**
     * Initializes the mobile menu with animations and event listeners.
     */
    function initializeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');

        if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay || !mobileMenuClose) {
            return;
        }

        const openMobileMenu = () => {
            mobileMenuBtn.classList.add('active');
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeMobileMenu = () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
        });

        mobileMenuClose.addEventListener('click', closeMobileMenu);
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    /**
     * Generates the Matrix-style digital rain effect.
     * Updated to create longer, more visually appealing columns.
     */
    function generateMatrixRain() {
        if (document.body.getAttribute('data-theme') !== 'matrix') return;
        const matrixRain = document.getElementById('matrix-rain-container');
        if (!matrixRain) return;
        matrixRain.innerHTML = ''; // Clear existing columns on resize
        const characters = '0123456789ABCDEFabcdefghijklmnopqrstuvwxyzアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const columns = Math.floor(window.innerWidth / 20);
        
        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = `${i * 20}px`;
            
            column.style.animationDuration = `${Math.random() * 10 + 10}s`;
            column.style.animationDelay = `${Math.random() * 10}s`;
            
            let text = '';
            const charCount = Math.floor(Math.random() * 40 + 30);
            for (let j = 0; j < charCount; j++) {
                text += characters[Math.floor(Math.random() * characters.length)];
            }
            column.textContent = text;
            
            matrixRain.appendChild(column);
        }
    }


    /**
     * Generates floating particles for the background.
     */
    function generateParticles() {
        if (document.body.getAttribute('data-theme') !== 'matrix') return;
        const particlesContainer = document.getElementById('particles-container');
        if (!particlesContainer) return;
        particlesContainer.innerHTML = '';
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 20}s`;
            particlesContainer.appendChild(particle);
        }
    }

    /**
     * Generates horizontal data stream effects.
     */
    function generateDataStreams() {
        if (document.body.getAttribute('data-theme') !== 'matrix') return;
        const dataStreams = document.getElementById('data-streams-container');
        if (!dataStreams) return;
        dataStreams.innerHTML = '';
        const streamCount = 10;
        
        for (let i = 0; i < streamCount; i++) {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            stream.style.top = `${Math.random() * 100}%`;
            stream.style.left = `-300px`;
            stream.style.animationDelay = `${Math.random() * 5}s`;
            dataStreams.appendChild(stream);
        }
    }
    
    /**
     * Creates a glowing effect that follows the cursor.
     */
    function createCursorGlow() {
        if (window.innerWidth <= 768 || document.body.getAttribute('data-theme') !== 'matrix') return;
        
        const cursorGlow = document.createElement('div');
        cursorGlow.style.cssText = `
            position: fixed;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
            left: 0;
            top: 0;
        `;
        document.body.appendChild(cursorGlow);

        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    }
    
    /**
     * Spawns random, temporary "cyber text" on the screen for ambiance.
     */
    function spawnCyberText() {
        if (document.body.getAttribute('data-theme') !== 'matrix') return;
        const cyberTexts = ['CONNECTING...', 'NEURAL LINK ESTABLISHED', 'QUANTUM SYNC ACTIVE', 'REALITY MATRIX LOADED', 'INITIATING GHOST PROTOCOL'];
        const randomText = cyberTexts[Math.floor(Math.random() * cyberTexts.length)];
        const tempElement = document.createElement('div');
        tempElement.textContent = randomText;
        tempElement.style.cssText = `
            position: fixed;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
            color: var(--theme-primary-accent);
            font-size: 0.8rem;
            font-weight: 700;
            z-index: 1000;
            opacity: 0.7;
            pointer-events: none;
            animation: fadeOut 3s ease-out forwards;
            text-shadow: 0 0 10px var(--theme-primary-accent);
        `;
        document.body.appendChild(tempElement);
        
        setTimeout(() => {
            if (document.body.contains(tempElement)) {
                document.body.removeChild(tempElement);
            }
        }, 3000);
    }
    
    /**
     * Handles mouse movement to create interactive effects, throttled for performance.
     */
    let mouseTimer: ReturnType<typeof setTimeout> | null;
    function handleMouseMove(e: MouseEvent) {
        if (document.body.getAttribute('data-theme') !== 'matrix') return;
        if (!mouseTimer) {
            mouseTimer = setTimeout(() => {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                const orbs = document.querySelectorAll('.orb');
                orbs.forEach((orb, index) => {
                    const speed = (index + 1) * 0.02;
                    const x = (mouseX - window.innerWidth / 2) * speed;
                    const y = (mouseY - window.innerHeight / 2) * speed;
                    (orb as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
                });
                
                if (window.innerWidth > 768) {
                    const particles = document.querySelectorAll('.particle');
                    particles.forEach(particle => {
                        const rect = particle.getBoundingClientRect();
                        const particleX = rect.left + rect.width / 2;
                        const particleY = rect.top + rect.height / 2;
                        const distance = Math.sqrt(Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2));
                        const p = particle as HTMLElement;
                        
                        if (distance < 150) {
                            const brightness = 1 - (distance / 150);
                            p.style.boxShadow = `0 0 ${15 + brightness * 25}px color-mix(in srgb, var(--theme-primary-accent) ${50 + brightness * 50}%, transparent)`;
                            p.style.transform = `scale(${1 + brightness * 0.5})`;
                        } else {
                            p.style.boxShadow = '';
                            p.style.transform = '';
                        }
                    });
                }
                
                mouseTimer = null;
            }, 32); // ~30fps throttle
        }
    }
    
    // --- INITIALIZE THEME & EFFECTS ---
    function initializeEffects() {
        initializeMobileMenu();
        generateParticles();
        generateMatrixRain();
        generateDataStreams();
        createCursorGlow();
        setInterval(spawnCyberText, 5000);
            
        let resizeTimer: ReturnType<typeof setTimeout>;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                generateMatrixRain();
                generateParticles();
                generateDataStreams();
            }, 250);
        });

        document.addEventListener('mousemove', handleMouseMove);
    }
    
    initializeEffects();


    // --- CHAT APPLICATION LOGIC ---
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // UI Elements
    const chatForm = document.getElementById('chat-form') as HTMLFormElement;
    const messageInput = document.getElementById('message-input') as HTMLInputElement;
    const sendButton = document.getElementById('send-button') as HTMLButtonElement;
    const recordButton = document.getElementById('record-button') as HTMLButtonElement;
    const attachButton = document.getElementById('attach-button') as HTMLButtonElement;
    const chatHeader = document.getElementById('chat-header-title') as HTMLElement;

    if (!messageList || !chatForm || !messageInput || !sendButton || !recordButton || !chatHeader || !attachButton) {
        console.error("Essential chat UI elements not found. Chat functionality disabled.");
        return;
    }

    // Persona Definitions
    const systemInstructions: Record<string, string> = {
        'btn-developer': 'أنت مطور برامج أول خبير. قدم إجابات تقنية مفصلة وحلولاً للمشكلات البرمجية. استخدم أمثلة التعليمات البرمجية عند الضرورة.',
        'btn-hr': 'أنت خبير في الموارد البشرية. أجب على جميع الأسئلة من منظور متخصص في سياسات الشركة وعلاقات الموظفين والتوظيف.',
        'btn-finance': 'أنت محلل مالي دقيق. أجب على جميع الأسئلة بأسلوب واضح ومبني على البيانات المالية وتحليل السوق.',
        'btn-marketing': 'أنت استراتيجي تسويق مبدع. قدم إجابات تركز على جذب العملاء ونمو العلامة التجارية والحملات الرقمية.',
        'btn-ceo': 'أنت رئيس تنفيذي (CEO) صاحب رؤية. قدم إجابات استراتيجية رفيعة المستوى تركز على نمو الأعمال والقيادة والابتكار في السوق.'
    };

    const initialMessages: Record<string, string> = {
        'btn-developer': 'تم التبديل إلى وضع المطور. كيف يمكنني المساعدة في مشروعك التالي؟',
        'btn-hr': 'تم التبديل إلى وضع خبير الموارد البشرية. كيف يمكنني المساعدة في أي مسائل تتعلق بالموظفين؟',
        'btn-finance': 'تم التبديل إلى وضع المحلل المالي. ما هي البيانات التي يمكنني تحليلها لك؟',
        'btn-marketing': 'تم التبديل إلى وضع استراتيجي التسويق. كيف يمكننا تعزيز علامتك التجارية اليوم؟',
        'btn-ceo': 'تم التبديل إلى وضع الرئيس التنفيذي. ما هي الأهداف الاستراتيجية التي يمكننا تحقيقها اليوم؟'
    };

    let chat: Chat;
    let isRecording = false;

    const updateSendButtonState = () => {
        const hasText = messageInput.value.trim().length > 0;
        const isWaitingForAi = messageInput.disabled;
        
        if (isRecording || isWaitingForAi) {
            sendButton.disabled = true;
        } else {
            sendButton.disabled = !hasText;
        }
    };
    
    const setFormState = (enabled: boolean) => {
      messageInput.disabled = !enabled;
      recordButton.disabled = !enabled;
      attachButton.disabled = !enabled;
      updateSendButtonState();
    };

    const scrollToBottom = () => {
      messageList.scrollTop = messageList.scrollHeight;
    };

    const addMessage = (text: string, sender: 'user' | 'ai', isStreaming: boolean = false): HTMLElement => {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', `${sender}-message`);

      const messageP = document.createElement('p');
      messageDiv.appendChild(messageP);

      if (isStreaming) {
        messageP.classList.add('thinking');
        messageP.textContent = '...يفكر';
      } else {
        messageP.textContent = text;
      }
      
      messageList.appendChild(messageDiv);
      scrollToBottom();
      return messageDiv;
    };
    
    const switchPersona = (personaId: string) => {
        const instruction = systemInstructions[personaId];
        if (!instruction) return;
        
        localStorage.setItem(PERSONA_KEY, personaId);

        personaOptions.forEach(b => b.classList.remove('active'));
        document.getElementById(personaId)?.classList.add('active');
        
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction: instruction },
        });

        const btnText = document.getElementById(personaId)?.textContent || 'Gemini';
        chatHeader.textContent = `محادثة مع خبير ${btnText}`;
        messageList.innerHTML = '';
        addMessage(initialMessages[personaId], 'ai');
        messageInput.focus();
    }
    
    personaOptions.forEach(button => {
        button.addEventListener('click', () => {
            switchPersona(button.id);
            if (themeMenu) {
                themeMenu.classList.remove('active');
            }
        });
    });

    // --- SPEECH RECOGNITION LOGIC ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition: any;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-SA';

      recognition.addEventListener('start', () => {
        isRecording = true;
        recordButton.classList.add('recording');
        recordButton.setAttribute('aria-label', 'إيقاف التسجيل');
        messageInput.placeholder = '...جاري الاستماع';
        updateSendButtonState();
      });

      recognition.addEventListener('end', () => {
        isRecording = false;
        recordButton.classList.remove('recording');
        recordButton.setAttribute('aria-label', 'سجل رسالة صوتية');
        messageInput.placeholder = 'اكتب رسالتك هنا...';
        updateSendButtonState();
        messageInput.focus();
      });

      recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        
        messageInput.value = transcript;
        updateSendButtonState();
      });

      recognition.addEventListener('error', (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        if (event.error && event.error !== 'no-speech') {
            addMessage(`خطأ في التعرف على الصوت: ${event.error}`, 'ai');
        }
      });

      recordButton.addEventListener('click', () => {
        if (isRecording) {
          recognition.stop();
        } else {
          messageInput.value = '';
          recognition.start();
        }
      });
    } else {
      console.warn("Speech Recognition not supported by this browser.");
      recordButton.style.display = 'none';
    }

    messageInput.addEventListener('input', updateSendButtonState);

    chatForm.addEventListener('submit', async (e: Event) => {
      e.preventDefault();

      if (isRecording) {
        recognition.stop();
      }

      const userInput = messageInput.value.trim();
      if (!userInput) return;

      setFormState(false);
      addMessage(userInput, 'user');
      messageInput.value = '';
      updateSendButtonState();

      const aiMessageDiv = addMessage('', 'ai', true);
      const p = aiMessageDiv.querySelector('p') as HTMLElement;
      let responseText = '';

      try {
        const responseStream = await chat.sendMessageStream({ message: userInput });
        
        let firstChunk = true;
        for await (const chunk of responseStream) {
          if(firstChunk) {
            p.classList.remove('thinking');
            p.textContent = '';
            firstChunk = false;
          }
          responseText += chunk.text;
          p.textContent = responseText;
          scrollToBottom();
        }
      } catch (error) {
          console.error(error);
          if (p) {
            p.textContent = "عذراً، حدث خطأ ما. الرجاء معاودة المحاولة في وقت لاحق.";
            p.style.color = 'var(--theme-secondary-accent)';
          }
      } finally {
        setFormState(true);
        messageInput.focus();
      }
    });

    // Initial setup on page load
    const savedPersona = localStorage.getItem(PERSONA_KEY) || 'btn-developer';
    switchPersona(savedPersona);
    updateSendButtonState();
    messageInput.focus();
});