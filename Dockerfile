# ==========================================
# STAGE 1: Build & Development Environment
# ==========================================
FROM node:20 AS builder

# הגדרת תיקיית העבודה בקונטיינר
WORKDIR /app

# העתקת קבצי החבילות בלבד לטובת ה-Cache
COPY package*.json ./

# התקנת כל הספריות (כולל ספריות פיתוח לצורך הבילד)
RUN npm install

# העתקת כל שאר קוד המקור של האפליקציה
COPY . .

# הרצת פקודת הבילד (במידה ויש TypeScript / בילד של הפרונטאנד)
# RUN npm run build


# ==========================================
# STAGE 2: Lean Production Runtime
# ==========================================
FROM node:20-alpine

# הגדרת סביבת עבודה כפרודקשן להאצת ביצועים
ENV NODE_ENV=production

WORKDIR /app

# 1. העתקת קבצי החבילות ושינוי בעלות מידי ל-node
COPY --chown=node:node package*.json ./

# 2. השינוי שזיהית: התקנת ספריות פרודקשן בלבד (בלי כלי פיתוח) וניקוי ה-Cache
RUN npm ci --only=production

# 3. העתקה אחת נקייה ומאובטחת מהבילדר (מחקנו את השורה הכפולה שהייתה בלי chown)
COPY --from=builder --chown=node:node /app .

# 4. מעבר בטוח למשתמש המוגבל
USER node

# חשיפת הפורט עליו האפליקציה מקשיבה
EXPOSE 3000

# פקודת ההרצה הישירה והנקייה של האפליקציה בפרודקשן
CMD [ "node", "app.js" ]