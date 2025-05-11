// flashcards.js - Simplified flashcard functionality for Admin Law Guide

document.addEventListener('DOMContentLoaded', function() {
    // Flashcard data
    const allFlashcards = [
        {
            id: "chevron",
            category: "judicial-review",
            title: "Chevron Doctrine",
            question: "What was the two-step framework for judicial review of agency statutory interpretations?",
            answer: "<p><strong>Step 1:</strong> Has Congress directly spoken to the precise question at issue? If yes, that's the end of the matter.</p><p><strong>Step 2:</strong> If the statute is silent or ambiguous, is the agency's interpretation reasonable?</p><p><em>Note: Loper Bright (2024) overturned this framework.</em></p>"
        },
        {
            id: "mqd",
            category: "constitutional",
            title: "Major Questions Doctrine",
            question: "When does the Major Questions Doctrine apply, and what does it require?",
            answer: "<p>Applies when an agency claims authority over a question of vast economic and political significance.</p><p>Requires: Clear congressional authorization for the agency's action.</p><p>Key cases: West Virginia v. EPA, NFIB v. OSHA</p>"
        },
        {
            id: "standing",
            category: "judicial-review",
            title: "Article III Standing",
            question: "What are the three requirements for Article III standing?",
            answer: "<p><strong>1. Injury in fact:</strong> Concrete, particularized, actual or imminent</p><p><strong>2. Causation:</strong> Fairly traceable to the challenged action</p><p><strong>3. Redressability:</strong> Likely to be redressed by a favorable decision</p><p>Zone of interests is a separate prudential requirement.</p>"
        },
        {
            id: "ripeness",
            category: "judicial-review",
            title: "Ripeness",
            question: "What is the Abbott Labs test for ripeness?",
            answer: "<p><strong>Two-part test:</strong></p><p>1. <strong>Fitness for judicial decision:</strong> Is the issue purely legal? Final agency action?</p><p>2. <strong>Hardship to parties:</strong> Would withholding review create direct and immediate hardship?</p><p>Key case: Abbott Laboratories v. Gardner</p>"
        },
        {
            id: "skidmore",
            category: "judicial-review",
            title: "Skidmore Deference",
            question: "When does Skidmore deference apply, and what factors determine its weight?",
            answer: "<p>Applies to agency interpretations that lack force of law.</p><p><strong>Weight depends on:</strong></p><p>- Thoroughness of consideration</p><p>- Validity of reasoning</p><p>- Consistency with earlier/later pronouncements</p><p>- Agency expertise</p><p>Now primary deference doctrine after Loper Bright (2024).</p>"
        },
        {
            id: "finalaction",
            category: "judicial-review",
            title: "Final Agency Action",
            question: "What is the Bennett v. Spear test for determining final agency action?",
            answer: "<p><strong>Two-part test:</strong></p><p>1. The action must mark the consummation of the agency's decision-making process</p><p>2. The action must be one by which rights or obligations have been determined, or from which legal consequences will flow</p><p>Both parts must be satisfied for an action to be considered 'final'</p>"
        },
        {
            id: "statefarm",
            category: "judicial-review",
            title: "State Farm Test",
            question: "What makes an agency action 'arbitrary and capricious' under State Farm?",
            answer: "<p>An agency rule is arbitrary and capricious if the agency:</p><p>1. Relied on factors Congress did not intend</p><p>2. Failed to consider an important aspect of the problem</p><p>3. Offered an explanation counter to the evidence</p><p>4. Is so implausible it couldn't be ascribed to expertise</p><p>This is known as 'hard look' review.</p>"
        },
        {
            id: "exhaustion",
            category: "judicial-review",
            title: "Exhaustion Doctrine",
            question: "When is a party required to exhaust administrative remedies?",
            answer: "<p><strong>General rule:</strong> Parties must exhaust available administrative remedies before seeking judicial review.</p><p><strong>Exceptions:</strong></p><p>- Futility</p><p>- Irreparable injury</p><p>- Agency bias</p><p>- Solely legal question</p><p>- Inadequate administrative remedy</p>"
        },
        {
            id: "formalrule",
            category: "agency-procedure",
            title: "Formal Rulemaking",
            question: "When is formal rulemaking required, and what procedures apply?",
            answer: "<p><strong>When required:</strong> Statute requires rules 'to be made on the record after opportunity for an agency hearing'</p><p><strong>Procedures (APA §§ 556-557):</strong></p><p>- Trial-type hearing</p><p>- Presentation of evidence</p><p>- Cross-examination</p><p>- Decision based on substantial evidence</p><p>Rarely required after Florida East Coast Railway.</p>"
        },
        {
            id: "goodcause",
            category: "agency-procedure",
            title: "Good Cause Exception",
            question: "When can agencies invoke the 'good cause' exception to notice-and-comment requirements?",
            answer: "<p>Agencies may skip notice and comment when it would be:</p><p>1. Impracticable</p><p>2. Unnecessary</p><p>3. Contrary to the public interest</p><p>Courts interpret this exception narrowly. Emergencies, national security, and economic crises may qualify, but mere time constraints usually don't.</p>"
        },
        {
            id: "evidence",
            category: "judicial-review",
            title: "Substantial Evidence Test",
            question: "What is the 'substantial evidence' standard of review?",
            answer: "<p><strong>Definition:</strong> 'Such relevant evidence as a reasonable mind might accept as adequate to support a conclusion'</p><p>More demanding than arbitrary and capricious review</p><p>Applies to formal proceedings (§§ 556-557) and some informal proceedings when specified by statute</p><p>Must consider the whole record, including evidence detracting from the agency's conclusion</p>"
        },
        {
            id: "nondelegation",
            category: "constitutional",
            title: "Nondelegation Doctrine",
            question: "What is the test for determining if Congress has improperly delegated legislative power?",
            answer: "<p><strong>Intelligible principle test:</strong> Congress must provide an 'intelligible principle' to guide the agency's discretion</p><p>Only successfully invoked twice (both in 1935)</p><p>Key cases:</p><p>- Schechter Poultry</p><p>- Panama Refining</p><p>The Court may be reconsidering the doctrine's leniency</p>"
        },
        {
            id: "interpretive",
            category: "agency-procedure",
            title: "Interpretive Rules",
            question: "What distinguishes interpretive rules from legislative rules?",
            answer: "<p><strong>Interpretive rules:</strong></p><p>- Explain existing law</p><p>- No independent legal effect</p><p>- Exempt from notice and comment</p><p><strong>Legislative rules:</strong></p><p>- Create new law, rights, or duties</p><p>- Have binding legal effect</p><p>- Require notice and comment</p><p>Courts look at substance, not agency labels</p>"
        },
        {
            id: "removal",
            category: "constitutional",
            title: "Removal Power",
            question: "What limitations can Congress place on the President's power to remove agency officials?",
            answer: "<p><strong>Current framework:</strong></p><p>- Principal officers of executive agencies: Cannot restrict removal</p><p>- Independent agency heads (multi-member commissions): May restrict removal to 'for cause'</p><p>- Inferior officers within independent agencies: May have up to two layers of for-cause protection only in limited circumstances</p><p>Recent cases favor presidential removal power (Seila Law, Collins)</p>"
        },
        {
            id: "zoi",
            category: "judicial-review",
            title: "Zone of Interests",
            question: "What is the 'zone of interests' test and how is it applied?",
            answer: "<p><strong>Definition:</strong> Requires plaintiff's injury to fall within the 'zone of interests' protected or regulated by the statute</p><p>Not a demanding test for APA cases - requires only that plaintiff not be 'marginally related' or 'inconsistent' with statutory purpose</p><p>More stringent when applied to other types of claims</p><p>Determined through traditional tools of statutory interpretation</p>"
        },
        {
            id: "reviewability",
            category: "judicial-review",
            title: "Reviewability",
            question: "When is agency action 'committed to agency discretion by law' and thus unreviewable?",
            answer: "<p><strong>'No law to apply' test:</strong></p><p>Agency action is unreviewable when the statute provides no meaningful standard to judge the agency's exercise of discretion</p><p><strong>Presumptively unreviewable areas:</strong></p><p>- Enforcement decisions (Heckler v. Chaney)</p><p>- Resource allocation</p><p>- National security</p><p>- Foreign affairs</p><p>Applies in 'rare circumstances'</p>"
        },
        {
            id: "chenery",
            category: "judicial-review",
            title: "Chenery Principle",
            question: "What is the Chenery principle and why is it important?",
            answer: "<p><strong>Chenery I:</strong> Courts may uphold agency action only on grounds the agency actually relied upon</p><p><strong>Chenery II:</strong> Agencies have discretion to proceed by rulemaking or case-by-case adjudication</p><p>Courts cannot substitute their judgment or reasoning for the agency's</p><p>Forces agencies to articulate their reasoning clearly during the administrative process</p>"
        },
        {
            id: "political",
            category: "constitutional",
            title: "Political Question Doctrine",
            question: "How does the political question doctrine affect judicial review of administrative action?",
            answer: "<p><strong>Baker v. Carr factors:</strong></p><p>1. Constitutional commitment to another branch</p><p>2. Lack of judicially manageable standards</p><p>3. Impossible to decide without policy determination</p><p>4. Impossible to resolve without disrespect to other branches</p><p>5. Unusual need for adherence to political decision</p><p>6. Potential embarrassment from multiple pronouncements</p><p>Rarely applied to administrative law, but may affect foreign affairs and national security decisions</p>"
        },
        {
            id: "dueprocess",
            category: "constitutional",
            title: "Procedural Due Process",
            question: "When is procedural due process required for agency actions?",
            answer: "<p><strong>Two-step analysis:</strong></p><p>1. Is there a protected interest (liberty or property)?</p><p>2. What process is due? (Mathews v. Eldridge balancing test)</p><p>- Private interest affected</p><p>- Risk of erroneous deprivation</p><p>- Government interest</p><p>Generally applies only to adjudications, not rulemaking (Bi-Metallic)</p>"
        },
        {
            id: "kisor",
            category: "judicial-review",
            title: "Kisor Deference",
            question: "When does Kisor deference apply to agency interpretations of regulations?",
            answer: "<p><strong>Prerequisites:</strong></p><p>1. Regulation must be genuinely ambiguous</p><p>2. Interpretation must be reasonable</p><p>3. Interpretation must reflect agency's authoritative position</p><p>4. Interpretation must implicate agency expertise</p><p>5. Interpretation must provide fair notice</p><p>Clarifies and limits previous Auer/Seminole Rock deference</p><p>Survived while Chevron was overturned</p>"
        },
        {
            id: "chadha",
            category: "constitutional",
            title: "Legislative Veto",
            question: "Why are legislative vetoes unconstitutional after INS v. Chadha?",
            answer: "<p><strong>Holding:</strong> Legislative vetoes violate bicameralism and presentment requirements of Article I</p><p><strong>Constitutional requirements for legislative action:</strong></p><p>1. Passage by both houses of Congress</p><p>2. Presentation to the President for signature or veto</p><p>Congress cannot reserve power to control execution of laws without following these procedures</p><p>Alternative: Joint resolution of disapproval under CRA</p>"
        },
        {
            id: "notice",
            category: "agency-procedure",
            title: "Notice Requirements",
            question: "What must be included in a notice of proposed rulemaking?",
            answer: "<p><strong>APA § 553 requirements:</strong></p><p>- Statement of time, place, and nature of proceedings</p><p>- Reference to legal authority</p><p>- Description of subjects and issues involved</p><p><strong>Courts also require:</strong></p><p>- Enough information for meaningful comment</p><p>- Technical studies and data relied upon</p><p>- Disclosure of regulatory approach and alternatives</p><p>Final rule must be 'logical outgrowth' of proposal</p>"
        },
        {
            id: "logical",
            category: "agency-procedure",
            title: "Logical Outgrowth Test",
            question: "What is the 'logical outgrowth' test for final rules?",
            answer: "<p><strong>Standard:</strong> A final rule must be a 'logical outgrowth' of the proposed rule</p><p>Interested parties should have anticipated that the change was possible and could have commented</p><p>If final rule deviates too much from proposal, agency must re-notice</p><p>Prevents agencies from 'changing course' without public input</p><p>Balances flexibility and fair notice</p>"
        },
        {
            id: "loperbright",
            category: "judicial-review",
            title: "Judicial Review After Loper Bright",
            question: "How should courts approach agency statutory interpretations after Loper Bright?",
            answer: "<p><strong>Post-Chevron framework:</strong></p><p>1. Courts determine the best reading of the statute using traditional tools of interpretation</p><p>2. Agency interpretations may receive Skidmore respect based on their persuasiveness</p><p>3. No deference to agency interpretations of ambiguous statutes</p><p>4. Major Questions Doctrine still applies, requiring clear congressional authorization for questions of vast economic and political significance</p>"
        },
        {
            id: "harmless",
            category: "judicial-review",
            title: "Harmless Error",
            question: "When will courts excuse agency procedural errors as 'harmless'?",
            answer: "<p><strong>APA § 706:</strong> Court shall take due account of the rule of prejudicial error</p><p><strong>For procedural errors:</strong></p><p>- Would the outcome have been different?</p><p>- Was the error substantive or merely technical?</p><p>- Was a fundamental right affected?</p><p>Burden typically on agency to prove harmlessness</p><p>Courts less likely to excuse notice-and-comment failures</p>"
        },
        {
            id: "mootness",
            category: "judicial-review",
            title: "Mootness and Ripeness",
            question: "How do mootness and ripeness doctrines limit judicial review of agency actions?",
            answer: "<p><strong>Mootness:</strong> Case no longer presents live controversy (exceptions: capable of repetition yet evading review; voluntary cessation)</p><p><strong>Ripeness:</strong> Prevents premature adjudication</p><p>- Abbott Labs test: (1) fitness for judicial decision; (2) hardship to parties</p><p>Both doctrines ensure concrete disputes rather than abstract disagreements</p>"
        }
    ];

    // Track mastered cards
    let masteredCards = localStorage.getItem('masteredCards') ? 
        JSON.parse(localStorage.getItem('masteredCards')) : [];

    // Function to initialize the flashcard system
    function initializeFlashcards() {
        updateProgressIndicator();
        setupCategoryTabs();
        loadInitialCards();
        setupFlashcardControls();
    }

    // Function to create and return a flashcard element
    function createFlashcardElement(cardData) {
        const flashcardElement = document.createElement('div');
        flashcardElement.className = 'flashcard';
        flashcardElement.setAttribute('data-category', cardData.category);
        flashcardElement.setAttribute('data-id', cardData.id);
        
        // Add mastered class if in localStorage
        if (masteredCards.includes(cardData.id)) {
            flashcardElement.classList.add('mastered');
        }
        
        // Create the HTML structure
        flashcardElement.innerHTML = `
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <div class="category-badge ${cardData.category}">${formatCategoryName(cardData.category)}</div>
                    <h4>${cardData.title}</h4>
                    <p>${cardData.question}</p>
                </div>
                <div class="flashcard-back">
                    <h4>${cardData.title}</h4>
                    <div class="answer">
                        ${cardData.answer}
                    </div>
                    <button class="mark-known-btn ${masteredCards.includes(cardData.id) ? 'known' : ''}" data-id="${cardData.id}">
                        ${masteredCards.includes(cardData.id) ? 'Marked as Known' : 'Mark as Known'}
                    </button>
                </div>
            </div>
        `;
        
        // Add click event to flip the card
        flashcardElement.addEventListener('click', function(e) {
            // Don't flip if clicking on the Mark as Known button
            if (e.target.classList.contains('mark-known-btn')) return;
            
            this.querySelector('.flashcard-inner').classList.toggle('flipped');
        });
        
        // Add event for the Mark as Known button
        const markKnownBtn = flashcardElement.querySelector('.mark-known-btn');
        markKnownBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card flip
            const cardId = this.getAttribute('data-id');
            
            if (!masteredCards.includes(cardId)) {
                // Mark as known
                masteredCards.push(cardId);
                localStorage.setItem('masteredCards', JSON.stringify(masteredCards));
                
                // Update button and card
                this.textContent = 'Marked as Known';
                this.classList.add('known');
                flashcardElement.classList.add('mastered');
            } else {
                // Remove from known
                masteredCards = masteredCards.filter(id => id !== cardId);
                localStorage.setItem('masteredCards', JSON.stringify(masteredCards));
                
                // Update button and card
                this.textContent = 'Mark as Known';
                this.classList.remove('known');
                flashcardElement.classList.remove('mastered');
            }
            
            updateProgressIndicator();
        });
        
        return flashcardElement;
    }

    // Function to format category name for display
    function formatCategoryName(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Function to update the progress indicator
    function updateProgressIndicator() {
        const totalCards = allFlashcards.length;
        const masteredCount = masteredCards.length;
        const progressPercentage = (masteredCount / totalCards) * 100;
        
        // Update the progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
        
        // Update the progress text
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${masteredCount} of ${totalCards} cards mastered (${Math.round(progressPercentage)}%)`;
        }
    }

    // Function to set up the category tabs
    function setupCategoryTabs() {
        const tabContainer = document.querySelector('.category-tabs');
        if (!tabContainer) return;
        
        const tabs = tabContainer.querySelectorAll('.category-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Filter the cards
                const category = this.getAttribute('data-category');
                filterCardsByCategory(category);
            });
        });
    }

    // Function to filter cards by category
    function filterCardsByCategory(category) {
        const cards = document.querySelectorAll('#flashcard-container .flashcard');
        let visibleCount = 0;
        
        cards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update the counter
        const counter = document.querySelector('.flashcard-counter');
        if (counter) {
            counter.textContent = `Showing ${visibleCount} of ${allFlashcards.length} total flashcards`;
        }
    }

    // Function to load initial cards
    function loadInitialCards() {
        const container = document.getElementById('flashcard-container');
        if (!container) return;
        
        // Clear the container
        container.innerHTML = '';
        
        // Add the first 3 cards as a starting point
        for (let i = 0; i < 3; i++) {
            const cardElement = createFlashcardElement(allFlashcards[i]);
            container.appendChild(cardElement);
        }
        
        // Update the counter
        const counter = document.querySelector('.flashcard-counter');
        if (counter) {
            counter.textContent = `Showing 3 of ${allFlashcards.length} total flashcards`;
        }
    }

    // Function to set up the flashcard controls
    function setupFlashcardControls() {
        // Set up the shuffle button
        const shuffleBtn = document.getElementById('shuffle-cards');
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', shuffleCards);
        }
        
        // Set up the show different cards button
        const showDifferentBtn = document.getElementById('show-different-cards');
        if (showDifferentBtn) {
            showDifferentBtn.addEventListener('click', showDifferentCards);
        }
    }

    // Function to shuffle the currently displayed cards
    function shuffleCards() {
        const container = document.getElementById('flashcard-container');
        if (!container) return;
        
        const cards = Array.from(container.children);
        
        // Reset any flipped cards
        cards.forEach(card => {
            card.querySelector('.flashcard-inner').classList.remove('flipped');
        });
        
        // Shuffle the cards using Fisher-Yates algorithm
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            container.appendChild(cards[i]); // Changing DOM order shuffles the cards visually
        }
    }

    // Function to show different cards
    function showDifferentCards() {
        const container = document.getElementById('flashcard-container');
        if (!container) return;
        
        // Get current card IDs
        const currentCardIds = Array.from(container.querySelectorAll('.flashcard'))
            .map(card => card.getAttribute('data-id'));
        
        // Get cards not currently shown
        const availableCards = allFlashcards.filter(card => !currentCardIds.includes(card.id));
        
        // If all cards have been shown, just reshuffle all cards
        const cardsToShow = availableCards.length > 0 ? availableCards : allFlashcards;
        
        // Get 3 random cards from available cards
        const shuffledCards = [...cardsToShow].sort(() => 0.5 - Math.random()).slice(0, 3);
        
        // Clear the container
        container.innerHTML = '';
        
        // Add the new cards
        shuffledCards.forEach(card => {
            const cardElement = createFlashcardElement(card);
            container.appendChild(cardElement);
        });
        
        // Update the counter
        const counter = document.querySelector('.flashcard-counter');
        if (counter) {
            counter.textContent = `Showing 3 of ${allFlashcards.length} total flashcards`;
        }
        
        // Update active category filter
        const activeTab = document.querySelector('.category-tab.active');
        if (activeTab) {
            const category = activeTab.getAttribute('data-category');
            if (category !== 'all') {
                filterCardsByCategory(category);
            }
        }
    }

    // Initialize when DOM is loaded
    initializeFlashcards();
});
