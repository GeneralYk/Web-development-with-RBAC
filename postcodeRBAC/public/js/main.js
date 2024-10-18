/**
 * @description Get the current theme settings for the website
 * @param {string} currentAppearanceColor - The current theme stored in the browser's local storage
 * @param {object} darkModeSetting - The dark theme settings
 */

const getCurrentThemeSettings = (currentAppearanceColor, darkModeSetting) => {
    // Check if the current theme color is in local storage
    if (currentAppearanceColor !== null) {
        return currentAppearanceColor;
    }

    // Check if the dark mode setting matches the system's color appearance
    if (darkModeSetting.matches) {
        return "dark";
    }

    return "light";
}

/**
 * @description Helper function to update the button text and aria-label
 * @param {HTMLButtonElement} buttonEl 
 * @param {string} isDarkMode 
 */
const updateThemeButtonController = (buttonEl, isDarkMode) => {
    const newButtonText = isDarkMode 
        ? 
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#FFFFFF" fill="none">
            <path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M12 2V3.5M12 20.5V22M19.0708 19.0713L18.0101 18.0106M5.98926 5.98926L4.9286 4.9286M22 12H20.5M3.5 12H2M19.0713 4.92871L18.0106 5.98937M5.98975 18.0107L4.92909 19.0714" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>` 
        : 
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
            <path d="M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`;
    buttonEl.setAttribute("aria-label", newButtonText);
    buttonEl.innerHTML = newButtonText;
}

/**
 * @description Helper function to update the theme class on the HTML tag
 * @param {string} theme - The new theme to update the html tag class to
 */
const updateAppearanceThemeOnHTMLTag = (theme) => {
    const htmlTag = document.querySelector("html");

    // Remove any existing theme
    htmlTag.classList.remove('dark', 'light');

    // Set the new theme
    htmlTag.classList.add(theme);
}

/**
 * On the load of the page, get necessary data from the DOM
 */
const themeSwitcherButton = document.getElementById("theme-switcher");
const currentAppearanceColor = localStorage.getItem("appearance");
const darkModeSetting = window.matchMedia("(prefers-color-scheme: dark)");

// Get the current appearance color
let currentTheme = getCurrentThemeSettings(currentAppearanceColor, darkModeSetting);

/**
 * On page load:
 * 1. Update the theme switcher button text according to current settings
 * 2. Update HTML tag class name with the appropriate appearance theme
 */
updateThemeButtonController(themeSwitcherButton, currentTheme === "dark");
updateAppearanceThemeOnHTMLTag(currentTheme);

/**
 * @description Event listener to toggle the appearance theme
 */
themeSwitcherButton.addEventListener("click", (event) => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
  
    localStorage.setItem("appearance", newTheme);
    updateThemeButtonController(themeSwitcherButton, newTheme === "dark");
    updateAppearanceThemeOnHTMLTag(newTheme);
  
    currentTheme = newTheme;
});


/**
 * @description Event listener to toggle the opening of the login/signup modal 
 */
const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");
const addPostCodeButton = document.getElementById("add-postcode-button");
const loginModal = document.getElementById("login-modal");
const signupModal = document.getElementById("signup-modal");
const addPostCodeModal = document.getElementById("create-postcode-modal");
const modalOverlay = document.querySelector(".postcode-modal-overlay");
const closeModalButtons = document.querySelectorAll(".postcode-modal-close-button");

const loginSignupActionsHTML = document.getElementById('login-signup-actions'); // Login and Signup buttons
const addPostcodeLogoutActionsHTML = document.getElementById('add-postcode-logout-actions'); // Add postcode and logout buttons
let isLoggedIn = false;
let loggedInUserID = null;
let isAdmin = false;

// Handle the opening of the login modal
if (loginButton) {
    loginButton.addEventListener("click", (event) => {
        loginModal.style.display = "block";
        modalOverlay.style.display = "block";
    });
}

// Handle the opening of the signup modal
if (signupButton) {
    signupButton.addEventListener("click", (event) => {
        signupModal.style.display = "block";
        modalOverlay.style.display = "block";
    });
}

// Handle the opening of the add postcode modal
if (addPostCodeButton) {
    addPostCodeButton.addEventListener("click", (event) => {
        addPostCodeModal.style.display = "block";
        modalOverlay.style.display = "block";
    });
}

// Set the modals and overlay to display none
const closeModals = () => {
    addPostCodeModal.style.display = "none";
    signupModal.style.display = "none";
    loginModal.style.display = "none";
    modalOverlay.style.display = "none";
}

// Handle the closing of the modal
[...closeModalButtons].forEach((closeModalButton) => {
    closeModalButton.addEventListener("click", (event) => {
        closeModals();
    });
});

// ============= TOAST NOTIFICATION ======================
/**
 * @description Handles setting the background color of the toast based on the status of the request
 * @param {HTMLDivElement} toast The toast div element
 * @param {String} status The status of the request response
 */
const setToastStateColor = (toast, status) => {
    if (status === 'success') {
        toast.style.setProperty('--toast-bg', '#eeffee');
        toast.style.setProperty('--toast-color', 'green');
    } else if (status === 'error') {
        toast.style.setProperty('--toast-bg', '#ffeeee');
        toast.style.setProperty('--toast-color', 'red');
    }
}

/**
 * @description Handles the toast notification
 * @param {String} status The status of the request response 
 * @param {String} message The message of the request response
 * @param {Number} duration The duration of the toast
 */
const showToast = (status, message, duration=5000) => {
    const toast = document.getElementById('message');
    toast.innerText = message;
    toast.classList.add('show');

   // Set the background color and text color for the toast
   setToastStateColor(toast, status);

    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        toast.removeAttribute('style');
    }, duration);

    // Remove the hide class after the animation completes to reset
    setTimeout(() => {
        toast.classList.remove('hide');
    }, 3500);
}
// ============= END TOAST NOTIFICATION ======================


// ============= FUNCTION TO CHECK IF USER IS LOGGED IN ======================
const checkUserLogin = () => {
    fetch('api/check_user_login.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                // Perform actions for logged-in users
                isLoggedIn = data.loggedIn;
                loggedInUserID = data.loggedInUserID
                isAdmin = data.isAdmin

                // Hide the login and signup buttons
                // and show the add postcode and logout buttons
                loginSignupActionsHTML.style.display = 'none';
                addPostcodeLogoutActionsHTML.style.display = 'block';
            } else {
                isLoggedIn = false;

                // Show the login and signup buttons
                // and hide the add postcode and logout buttons
                loginSignupActionsHTML.style.display = 'block';
                addPostcodeLogoutActionsHTML.style.display = 'none';
            }
        })
        .catch(error => console.error('Error:', error));
};
checkUserLogin();
// ============= END FUNCTION TO CHECK IF USER IS LOGGED IN ======================


// ============= FUNCTION TO HANDLE LOGIN OF USER ======================
/**
 * @description Handle the asynchronous submission of the login form
 */
const loginForm = document.querySelector("#login-modal form");
loginForm.addEventListener("submit", async(event) => {
    event.preventDefault();
    
    const formData = new FormData(loginForm);
    const response = await fetch('api/login.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    if (result.success) {
        showToast("success", result.message);

        // Reset the form data
        loginForm.reset();

        // Close the modal
        closeModals();
        
        // Wait for 5s before page reload
        setTimeout(() => {
            window.location.reload();
        }, 3000)
    } else {
        showToast("error", result.message);
    }
});
// ============= END FUNCTION TO HANDLE LOGIN OF USER ======================


// ============= FUNCTION TO HANDLE SIGNUP OF USER ======================
/**
 * @description Handle the asynchronous submission of the signup form
 */
const signupForm = document.querySelector("#signup-modal form");
signupForm.addEventListener("submit", async(event) => {
    event.preventDefault();
    
    const formData = new FormData(signupForm);
    const response = await fetch('api/signup.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    if (result.success) {
        showToast("success", result.message);

        // Reset the form data
        signupForm.reset();

        // Close the modal
        closeModals();

        // Wait for 5s before page reload
        setTimeout(() => {
            window.location.reload();
        }, 3000)
    } else {
        showToast("error", result.message);
    }
});
// ============= END FUNCTION TO HANDLE SIGNUP OF USER ======================


// ============= FUNCTION TO HANDLE LOGOUT OF USER ======================
/**
 * @description Handle the asynchronous logging out of user
 */
const logoutButton = document.getElementById("logout-button");

if (logoutButton) {
    logoutButton.addEventListener("click", async(event) => {
        event.preventDefault();

        const response = await fetch('api/logout.php', {
            method: 'POST'
        });

        const result = await response.json();

        if (result.success) {
            showToast("success", result.message);
            
            // Wait for 5s before page reload
            setTimeout(() => {
                window.location.reload();
            }, 3000)
        }
    });
};
// ============= END FUNCTION TO HANDLE LOGOUT OF USER ======================


// ============= FUNCTION TO FETCH ALL POSTCODES ======================
/**
 * @description The Postcode HTML
 * @param {String} postcode The postcode
 * @param {Number} postcodeID The postcode ID
 * @returns {HTMLDivElement} The HTML div element containing the postcode
 */
const postCodeCardHTML = (postcode, postcodeID, userID, loggedInUserID, isAdmin) => { 
    return `
    <div class="postcode-card-content">
        <div class="flex-between">
            <div class="postcode-card-icon-wrapper">
                <img src="public/images/location-map.svg" alt="Map Icon">
            </div>
            <label for="postcode-item-${postcodeID}">
                <input type="checkbox" name="options" id="postcode-item-${postcodeID}" value="${postcode}"/>
            </label>
        </div>
        <div class="postcode-card-info">
            <h3 class="postcode-code">${postcode}</h3>
        </div>
    </div>
    <div class="postcode-card-footer">
        <a href="detail.html?postcodeID=${postcodeID}" class="postcode-card-link">
            See details
        </a>
        ${isLoggedIn && (isAdmin || userID === loggedInUserID) ? `
            <div class="postcode-card-actions">
                <button type="button" title="Edit postcode" class="button-success" data-id="${postcodeID}" onclick="editPostCode(${postcodeID})">
                    Edit
                </button>
                <button type="button" title="Delete postcode" class="button-danger" data-id="${postcodeID}" onclick="deletePostCode(${postcodeID})">
                    Delete
                </button>
            </div>
        ` : ""}
    </div>
    `
};

/**
 * @description Handle the asynchronous submission of the postcode form
 */
const postcodeList = document.querySelector('.postcodes-list'); // Postcodes list wrapper
const fetchPostcodes = async() => {
    postcodeList.innerHTML = 'Loading...';

    const response = await fetch('api/fetch_postcodes.php');
    const result = await response.json();

    if (result.success) {
        // showToast("success", result.message);

        postcodeList.innerHTML = '';
        // Generate the postcode card for each postcode in the response array
        result.postcodes.forEach(({postcode, postcodeID, userID}) => {
            const postcodeCard = document.createElement("div");
            postcodeCard.className = "postcode-card";
            postcodeCard.innerHTML = postCodeCardHTML(postcode, postcodeID, userID, loggedInUserID, isAdmin);

            postcodeList.appendChild(postcodeCard);
        });
    } else {
        showToast("error", result.message);
    }
};

// Call the function on page load
if (postcodeList) {
    fetchPostcodes();
}
// ============= END FUNCTION TO FETCH ALL POSTCODES ======================


// ============= FUNCTION TO GET POSTCODE DETAIL FROM DB ======================
const postcodeDetailsHTML = (data) => {
    let detail = '';
    
    if (data) {
        detail = `
            <div class="postcode-details-pill">
                <p class="postcode-key">POSTCODE: </p>
                <p class="postcode-value">${data?.postcode}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">eastings: </p>
                <p class="postcode-value">${data?.eastings}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">northings: </p>
                <p class="postcode-value">${data?.northings}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">country: </p>
                <p class="postcode-value">${data?.country}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">nhs ha: </p>
                <p class="postcode-value">${data?.nhs_ha}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">longitude: </p>
                <p class="postcode-value">${data?.longitude}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">latitude: </p>
                <p class="postcode-value">${data?.latitude}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">european electoral region: </p>
                <p class="postcode-value">${data?.european_electoral_region}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">primary care trust: </p>
                <p class="postcode-value">${data?.primary_care_trust}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">region: </p>
                <p class="postcode-value">${data?.region}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">lsoa: </p>
                <p class="postcode-value">${data?.lsoa}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">msoa: </p>
                <p class="postcode-value">${data?.msoa}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">incode: </p>
                <p class="postcode-value">${data?.incode}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">outcode: </p>
                <p class="postcode-value">${data?.outcode}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">parliamentary constituency: </p>
                <p class="postcode-value">${data?.parliamentary_constituency}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">parliamentary constituency 2024: </p>
                <p class="postcode-value">${data?.parliamentary_constituency_2024}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">admin district: </p>
                <p class="postcode-value">${data?.admin_district}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">parish: </p>
                <p class="postcode-value">${data?.parish}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">admin county: </p>
                <p class="postcode-value">${data?.admin_county}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">date of introduction: </p>
                <p class="postcode-value">${data?.date_of_introduction}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">admin ward: </p>
                <p class="postcode-value">${data?.admin_ward}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">ced: </p>
                <p class="postcode-value">${data?.ced}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">ccg: </p>
                <p class="postcode-value">${data?.ccg}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">nuts: </p>
                <p class="postcode-value">${data?.nuts}</p>
            </div>
            <div class="postcode-details-pill">
                <p class="postcode-key">pfa: </p>
                <p class="postcode-value">${data?.pfa}</p>
            </div>
        `;
    }

    return detail;
}
const getPostcodeDetail = async () => {
    // Get the details page URL
    const searchParams = new URLSearchParams(window.location.search);
    const postcodeDetailsWrapper = document.querySelector(".postcode-details");

    // Check if the URL has a postcodeID parameter
    if (searchParams.has('postcodeID')) {
        const postcodeID = searchParams.get('postcodeID');

        postcodeDetailsWrapper.innerHTML = 'Fetching postcode details...';

        const response = await fetch(`api/get_postcode_detail.php?postcodeID=${postcodeID}`);
        const result = await response.json();

        if (result.success) {
            const postcodeData = await fetchPostcodeDetail(result.postcode);

            postcodeDetailsWrapper.innerHTML = '';

            // Display the postcode details in the HTML
            if (postcodeDetailsWrapper) {
                postcodeDetailsWrapper.innerHTML = postcodeDetailsHTML(postcodeData);
            }
        } else {
            showToast("success", result.message);
        }
    } else {
        console.error("No postcode ID provided");
    }
};
// ============= END FUNCTION TO GET POSTCODE DETAIL FROM DB ======================


// ============= FUNCTION TO FETCH POSTCODE DETAIL FROM API.POSTCODE.IO ======================
/**
 * @description Returns the postcode details from https://api.postcode.io
 * @param {Number} postcodeID 
 */
const fetchPostcodeDetail = async (postcodeID) => {
    const response = await fetch(`api/fetch_postcode_details.php?postcode=${postcodeID}`);
    const result = await response.json();

    return result.data
};
// ============= END FUNCTION TO FETCH POSTCODE DETAIL FROM API.POSTCODE.IO ======================

// ============= FUNCTION TO SEARCH POSTCODES ======================
/**
 * @description Handle the asynchronous searching of postcodes
 */
const searchForm = document.getElementById("search-form");

if (searchForm) {
    searchForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const formData = new FormData(searchForm);

        postcodeList.innerHTML = 'Loading...';
        const response = await fetch('api/search_postcodes.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showToast("success", result.message);

            postcodeList.innerHTML = '';
            result.postcodes.forEach(({postcode, postcodeID, userID}) => {
                const postcodeCard = document.createElement("div");
                postcodeCard.className = "postcode-card";
                postcodeCard.innerHTML = postCodeCardHTML(postcode, postcodeID, userID, loggedInUserID, isAdmin);

                postcodeList.appendChild(postcodeCard);
            });
        } else {
            postcodeList.innerHTML = result.message;
        }
    });
}
// ============= END FUNCTION TO SEARCH POSTCODES ======================


// ============= FUNCTION TO HANDLE ADD OF POSTCODE ======================
/**
 * @description Adds a new postcode
 * @param {String} postcode The new postcode
 */
const addPostCodeForm = document.querySelector("#create-postcode-modal form");
const addPostcode = async(postcode) => {
    const response = await fetch('api/add_postcode.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `postcode=${postcode}`
    });

    const result = await response.json();
    if (result.success) {
        showToast("success", result.message);

        // Reset form data
        addPostCodeForm.reset();

        // Fetch the postcodes again
        fetchPostcodes();

        // Close the modal
        closeModals();
    } else {
        showToast("error", result.message);
    }
};

/**
 * @description Handle the asynchronous submission of the postcode form to add a new postcode
 */
addPostCodeForm.addEventListener("submit", async(event) => {
    event.preventDefault();
    
    const formData = new FormData(addPostCodeForm);
    for (let keyValue of formData.entries()) {
        // Add the new postcode
        addPostcode(keyValue[1]);
	}
});
// ============= END FUNCTION TO HANDLE ADD OF POSTCODE ======================


// ============= FUNCTION TO HANDLE EDIT OF POSTCODE ======================
/**
 * @description Handle the asynchronous editing of the selected postcode
 * @param {Number} postcodeID The ID of the postcode to edit
 * @param {String} newPostcode The new postcode
 */
const editPostCode = async(postcodeID) => {
    const newPostcode = prompt("Enter new postcode:");
    if (newPostcode) {
        const response = await fetch('api/edit_postcode.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `postcodeID=${postcodeID}&newPostcode=${newPostcode}`
        });

        const result = await response.json();
        if (result.success) {
            showToast("success", result.message);

            // Fetch the postcodes again
            fetchPostcodes();
        } else {
            showToast("error", result.message);
        }
    }
};
// ============= END FUNCTION TO HANDLE EDIT OF POSTCODE ======================


// ============= FUNCTION TO HANDLE DELETING A POSTCODE ======================
/**
 * @description Handle the asynchronous deleting of the selected postcode
 * @param {Number} postcodeID The ID of the postcode to delete
 */
const deletePostCode = async(postcodeID) => {
    if (confirm("Are you sure you want to delete this postcode?")) {
        const response = await fetch('api/delete_postcode.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `postcodeID=${postcodeID}`
        });

        const result = await response.json();
        if (result.success) {
            showToast("success", result.message);
            fetchPostcodes();
        } else {
            showToast("error", result.message);
        }
    }
};
// ============= END FUNCTION TO HANDLE DELETING A POSTCODE ======================  


// ============= FUNCTION TO HANDLE CALCULATING THE DISTANCE BETWEEN TWO POSTCODES ======================  
let selectedPostCodes;

/**
 * @description Toggle the background color
 * @param {HTMLInputElement} checkbox 
 */
const toggleBackgroundColor = (checkbox) => {
    const postcodeCardContent = checkbox.closest('.postcode-card');
    if (checkbox.checked) {
        postcodeCardContent.classList.add('checked-background');
    } else {
        postcodeCardContent.classList.remove('checked-background');
    }
};

/**
 * @description Get the values of the selected postcode
 */
const getCheckedValues = () => {
    // Get all checked checkboxes with the name 'options'
    const checkboxes = document.querySelectorAll('input[name="options"]:checked');

    // Initialize an array to hold the values of checked checkboxes
    const checkedValues = [];

    // Iterate over the checked checkboxes and push their values to the array
    checkboxes.forEach((checkbox) => {
        checkedValues.push(checkbox.value);
    });

    selectedPostCodes = checkedValues;

    if(checkedValues.length == 2) {
        document.querySelector('.postcode-distance').classList.add('visible');
    } else {
        document.querySelector('.postcode-distance').classList.remove('visible');
    }
}

/**
 * @description Update the message when the checkboxes are selected
 */
const updateMessage = () => {
    const checkboxes = document.querySelectorAll('input[name="options"]');
    const checkedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;

    // Message is updated
    if (checkedCount <= 2) {
        showToast("success", `${checkedCount} of 2 postcodes selected`);
    } else {
        showToast("error", `You can only select just 2 postcodes`);
    }
};

// Delay execution by 3 seconds
setTimeout(() => {
    // Add event listeners to all checkboxes with the name 'options'
    document.querySelectorAll('input[name="options"]').forEach((checkbox) => {
        checkbox.addEventListener('change', getCheckedValues);
        checkbox.addEventListener('change', updateMessage);
        checkbox.addEventListener('change', () => toggleBackgroundColor(checkbox));
    });
}, 3000);

/**
 * @description Calculate the distance between two longitudinal and latitudinal points
 * @param {GLfloat} latitude1 
 * @param {GLfloat} latitude2 
 * @param {GLfloat} longitude1 
 * @param {GLfloat} longitude2 
 * @returns {GLfloat} The distance between two longitudinal and latitudinal points
 */
const calculateDistance = (latitude1, longitude1, latitude2, longitude2) => {
    const R = 6371000; // Radius of the Earth in meters

    const toRadians = (degree) => degree * (Math.PI / 180);

    const φ1 = toRadians(latitude1);
    const φ2 = toRadians(latitude2);
    const Δφ = toRadians(latitude2 - latitude1);
    const Δλ = toRadians(longitude2 - longitude1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return distance / 1609.34; // Convert to miles
};

const postcodeDistanceButton = document.getElementById('calculate-postcode-distance-button');
const distancePanel = document.querySelector('.postcode-distance-panel');
const distanceValue = document.querySelector('.distance-result');
const selectedPostCode1 = document.querySelector('.selected-postcode-1');
const selectedPostCode2 = document.querySelector('.selected-postcode-2');
const distanceClosePanelButton = document.getElementById('close-postcode-distance-button');

/**
 * @description Calculates the distance between two selected postcodes
 * @param {String} postcode1 The first selected postcode
 * @param {String} postcode2 The second selected postcode
 */
const calculateDistanceBetweenPostcodes = async(postcode1, postcode2) => {
    postcodeDistanceButton.innerHTML = `Calculating...`;

    // Fetch latitude and longitude 
    const coordinates1 = await fetchPostcodeDetail(postcode1)
    const coordinates2 = await fetchPostcodeDetail(postcode2)
    
    if (coordinates1 && coordinates2) {
        const distance = calculateDistance(
            coordinates1?.latitude, coordinates1?.longitude,
            coordinates2?.latitude, coordinates2?.longitude
        );

        distancePanel.classList.add('visible');
        distanceValue.textContent = distance.toFixed(2);

        if (selectedPostCodes && selectedPostCodes.length == 2) {
            selectedPostCode1.textContent = selectedPostCodes[0];
            selectedPostCode2.textContent = selectedPostCodes[1];
        }
    }

    postcodeDistanceButton.innerHTML = `
        <img src="public/images/location-map.svg" alt="Map Icon">
        <span>Calculate Distance</span>
    `;
};

// Close the distance panel
distanceClosePanelButton.addEventListener('click', () => {
    distancePanel.classList.remove('visible');
});

/**
 * Handle the calculation of the distance between two postcodes
 */
postcodeDistanceButton.addEventListener('click', () => {
    if (selectedPostCodes && selectedPostCodes.length == 2) {
        calculateDistanceBetweenPostcodes(selectedPostCodes[0], selectedPostCodes[1]);
    } else {
        showToast("error", "Please select exactly two postcodes!");
    }
});
// ============= END FUNCTION TO HANDLE CALCULATING THE DISTANCE BETWEEN TWO POSTCODES ======================  

if (window.location.href.includes('detail.html?postcodeID=')) {
    getPostcodeDetail();
}