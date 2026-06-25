const API_URL = "http://localhost:3000/api/users";

// אלמנטים מה-HTML - הותאמו בדיוק ל-ID שקיימים בקובץ ה-HTML שלך כדי שלא נקבל TypeError
const totalUsers = document.getElementById('totalUsers');
const average = document.getElementById('average'); // התאמה ל-ID בקובץ ה-HTML (במקום avgAge)
const addUserForm = document.getElementById('addUserForm');
const userGrid = document.getElementById('userGrid');   // התאמה ל-ID בקובץ ה-HTML (במקום usersGrid)

// פונקציה אסינכרונית לטעינת המשתמשים מהבקאנד והצגתם
async function loadUsers() {
    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        console.log(users);
        renderUsers(users);
    } catch (error) {
        console.error(error, "Error loading users");
    }
}

// פונקציה שמקבלת את מערך המשתמשים ומציגה אותם על המסך
function renderUsers(users) {
    console.log(users.length);

    // עדכון מספר המשתמשים הכולל במידה והאלמנט קיים בדף
    if (totalUsers) {
        totalUsers.innerText = users.length;
    }

    // חישוב ממוצע הגילאים ועדכון ה-HTML (הותאם משתנה ה-DOM: average)
    if (average) {
        const totalAge = users.reduce((sum, user) => sum + (user.age || 0), 0);
        const avg = users.length ? (totalAge / users.length).toFixed(1) : 0;
        average.innerText = avg;
    }

    // אם אין משתמשים ב-Database, נציג הודעה מתאימה בגריד המשתמשים
    if (users.length === 0) {
        userGrid.innerHTML = `
          <p>No users yet, please add one.</p>
        `;
        return;
    }

    // ריצה על כל המשתמשים ויצירת כרטיסיית HTML לכל אחד (משתמש באלמנט המותאם: userGrid)
    userGrid.innerHTML = users.map((user) => `
        <div class="card">
           <button class="deleteBtn" onclick="deleteUser('${user._id}')">🗑️</button>
           <div>${user.name}</div>
           <div>${user.email}</div>
           <div>${user.age}</div>
        </div>
    `).join("");
}

// פונקציה למחיקת משתמש לפי ה-ID הייחודי שלו מ-MongoDB
async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        loadUsers(); // קריאה מחדש לפונקציה כדי לרענן את הרשימה על המסך מיד לאחר המחיקה
    } catch (error) {
        console.error(error, "Error deleting user.");
    }
}

// האזנה לאירוע שליחת הטופס (Submit) לצורך הוספת משתמש חדש לבקאנד
if (addUserForm) {
    addUserForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // מונע מהדף להתרענן באופן אוטומטי ושומר עלינו באותו עמוד

        // שליפת הערכים שהקליד המשתמש בשדות הקלט של ה-HTML
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const age = document.getElementById('age').value;

        try {
            // שליחת בקשת POST לבקאנד עם נתוני המשתמש החדש בפורמט JSON
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, age: Number(age) }),
            });

            if (response.ok) {
                addUserForm.reset(); // איפוס וניקוי שדות הטופס לאחר הצלחה
                loadUsers();         // טעינה מחדש של רשימת המשתמשים כדי להציג את המשתמש שנוסף מיד
            } else {
                const errorData = await response.json();
                console.error("User creation failed:", errorData.message);
            }
        } catch (error) {
            console.error("Error adding user:", error);
        }
    });
}

// הפעלה אוטומטית של הפונקציה ברגע שהקובץ נטען בדפדפן
loadUsers();