        // Get references to HTML elements
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        const unitCategorySelect = document.getElementById('unitCategory');
        const fromValueInput = document.getElementById('fromValue');
        const fromUnitSelect = document.getElementById('fromUnit');
        const toValueInput = document.getElementById('toValue');
        const toUnitSelect = document.getElementById('toUnit');
        const convertButton = document.getElementById('convertButton');

        // Define conversion rates for various unit categories
        // All conversions are based on a common base unit for each category
        const units = {
            length: {
                meter: 1,
                kilometer: 1000,
                centimeter: 0.01,
                millimeter: 0.001,
                micrometer: 0.000001,
                nanometer: 0.000000001,
                mile: 1609.34,
                yard: 0.9144,
                foot: 0.3048,
                inch: 0.0254,
                'nautical mile': 1852
            },
            weight: {
                kilogram: 1,
                gram: 0.001,
                milligram: 0.000001,
                pound: 0.453592,
                ounce: 0.0283495,
                tonne: 1000,
                'metric ton': 1000,
                carat: 0.0002
            },
            temperature: {
                celsius: {
                    toBase: (c) => c, // Celsius is the base for temperature (0 Celsius = 0 base unit)
                    fromBase: (b) => b
                },
                fahrenheit: {
                    toBase: (f) => (f - 32) * 5 / 9,
                    fromBase: (b) => (b * 9 / 5) + 32
                },
                kelvin: {
                    toBase: (k) => k - 273.15,
                    fromBase: (b) => b + 273.15
                }
            },
            volume: {
                liter: 1,
                milliliter: 0.001,
                'cubic meter': 1000,
                'cubic centimeter': 0.001,
                gallon: 3.78541,
                quart: 0.946353,
                pint: 0.473176,
                cup: 0.236588,
                'fluid ounce': 0.0295735,
                tablespoon: 0.0147868,
                teaspoon: 0.00492892
            },
            time: {
                second: 1,
                millisecond: 0.001,
                minute: 60,
                hour: 3600,
                day: 86400,
                week: 604800,
                month: 2629746, // Average month
                year: 31556952 // Average year
            }
        };

        // Define unit categories to be displayed in the dropdown
        const unitCategories = {
            length: "Length",
            weight: "Weight",
            temperature: "Temperature",
            volume: "Volume",
            time: "Time"
        };

        /**
         * Populates the category dropdown with options.
         */
        function populateCategoryDropdown() {
            unitCategorySelect.innerHTML = ''; // Clear existing options
            for (const categoryKey in unitCategories) {
                const option = document.createElement('option');
                option.value = categoryKey;
                option.textContent = unitCategories[categoryKey];
                unitCategorySelect.appendChild(option);
            }
        }

        /**
         * Populates the unit dropdowns based on the selected category.
         */
        function populateUnitDropdowns() {
            const selectedCategory = unitCategorySelect.value;
            const categoryUnits = units[selectedCategory];

            // Clear existing options
            fromUnitSelect.innerHTML = '';
            toUnitSelect.innerHTML = '';

            // Add new options for the selected category
            for (const unit in categoryUnits) {
                const option1 = document.createElement('option');
                option1.value = unit;
                option1.textContent = unit.charAt(0).toUpperCase() + unit.slice(1); // Capitalize first letter
                fromUnitSelect.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = unit;
                option2.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
                toUnitSelect.appendChild(option2);
            }

            // Set default selections
            if (fromUnitSelect.options.length > 0) {
                fromUnitSelect.value = Object.keys(categoryUnits)[0]; // Select the first unit by default
                if (toUnitSelect.options.length > 1) {
                    toUnitSelect.value = Object.keys(categoryUnits)[1]; // Select the second unit by default for 'to'
                } else {
                    toUnitSelect.value = Object.keys(categoryUnits)[0]; // If only one unit, select the same
                }
            }
            // Clear the 'To Value' input field when a new category is selected
            toValueInput.value = '';
        }

        /**
         * Performs the unit conversion based on the selected category, units, and input value.
         */
        function convertUnits() {
            const selectedCategory = unitCategorySelect.value;
            const inputValue = parseFloat(fromValueInput.value);
            const fromUnit = fromUnitSelect.value;
            const toUnit = toUnitSelect.value;

            // Check for invalid input
            if (isNaN(inputValue) || !fromUnit || !toUnit) {
                toValueInput.value = ''; // Clear output if input is invalid
                return;
            }

            let convertedValue;

            // Handle temperature conversions separately due to their non-linear nature
            if (selectedCategory === 'temperature') {
                const fromConverter = units.temperature[fromUnit];
                const toConverter = units.temperature[toUnit];

                // Convert input value to the base temperature unit (Celsius equivalent)
                const baseValue = fromConverter.toBase(inputValue);
                // Convert from the base unit to the target unit
                convertedValue = toConverter.fromBase(baseValue);
            } else {
                // For other categories (length, weight, volume, time), use linear conversion factors
                const fromRate = units[selectedCategory][fromUnit];
                const toRate = units[selectedCategory][toUnit];

                // Convert input value to the category's base unit, then to the target unit
                convertedValue = (inputValue * fromRate) / toRate;
            }

            // Display the converted value, formatted to 6 decimal places
            toValueInput.value = convertedValue.toFixed(6);
        }

        /**
         * Initializes the theme based on localStorage or defaults to light theme.
         */
        function initializeTheme() {
            // Check if a theme preference is stored in local storage
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme === 'dark') {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                themeToggle.checked = true; // Set the toggle switch to checked for dark theme
            } else {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                themeToggle.checked = false; // Set the toggle switch to unchecked for light theme
            }
        }

        // --- Event Listeners ---

        // Listen for changes in the unit category dropdown
        unitCategorySelect.addEventListener('change', populateUnitDropdowns);

        // Listen for clicks on the Convert button
        convertButton.addEventListener('click', convertUnits);

        // Listen for changes on the theme toggle switch
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark'); // Store dark theme preference
            } else {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                localStorage.setItem('theme', 'light'); // Store light theme preference
            }
        });

        // --- Initial Setup ---

        // Initialize the theme when the page loads
        initializeTheme();
        // Populate category dropdown first
        populateCategoryDropdown();
        // Then populate unit dropdowns.
        populateUnitDropdowns();