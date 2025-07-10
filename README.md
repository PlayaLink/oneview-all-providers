# OneView All Providers - Local Development Guide

Welcome to the OneView All Providers project! This guide will help you get the project running on your computer, even if you're new to development. We'll use AI assistance to make this process as smooth as possible.

## 🎯 What is This Project?

OneView All Providers is a web application for managing healthcare provider information. It includes features like:
- Provider search and management
- Grid-based data views
- Document management
- Team collaboration tools

## 🚀 Step 1: Download Cursor (Your AI Development Assistant)

**Why Cursor?** Cursor is a code editor (like a smart text editor) that has AI built-in. It can help you with any questions or issues you encounter while setting up the project.

1. Go to [cursor.sh](https://cursor.sh)
2. Click "Download for Mac" (or Windows if you're on Windows)
3. Install the application
4. Open Cursor

**💡 Pro Tip:** Once Cursor is open, you can chat with AI by pressing `Cmd+K` (Mac) or `Ctrl+K` (Windows). Ask it anything about the setup process!

## 📋 Prerequisites

Before we start, make sure you have these installed:

### Node.js (Required)
Node.js is like the engine that runs our web application.

1. Go to [nodejs.org](https://nodejs.org)
2. Download the "LTS" version (the green button)
3. Install it by following the prompts
4. **Verify installation:** Open Terminal (Mac) or Command Prompt (Windows) and type:
   ```bash
   node --version
   ```
   You should see something like `v18.17.0` or higher.

### Git (Required)
Git helps us track changes to our code and download the project.

1. Go to [git-scm.com](https://git-scm.com)
2. Download for your operating system
3. Install with default settings
4. **Verify installation:** In Terminal/Command Prompt, type:
   ```bash
   git --version
   ```
   You should see something like `git version 2.39.0` or higher.

## 🔧 Step 2: Download the Project

1. **Open Terminal (Mac) or Command Prompt (Windows)**
   - Mac: Press `Cmd+Space`, type "Terminal", press Enter
   - Windows: Press `Windows+R`, type "cmd", press Enter

2. **Navigate to where you want to store the project**
   ```bash
   # Mac example - store in Documents
   cd ~/Documents
   
   # Windows example - store in Documents
   cd C:\Users\YourName\Documents
   ```

3. **Download the project**
   ```bash
   git clone https://github.com/PlayaLink/oneview-all-providers.git
   ```

4. **Enter the project folder**
   ```bash
   cd oneview-all-providers
   ```

## 🔑 Step 3: Set Up Environment Variables

The project needs some secret keys to connect to our database and services.

1. **In Cursor, open the project:**
   - File → Open Folder → Select the `oneview-all-providers` folder

2. **Find the example environment file:**
   - In the file explorer (left sidebar), look for `env.example`
   - Right-click on it and select "Copy"

3. **Create a new environment file:**
   - Right-click in the file explorer
   - Select "New File"
   - Name it `.env` (exactly like that, with the dot)

4. **Copy the contents:**
   - Open `env.example` and copy all its contents
   - Paste them into the new `.env` file

5. **Get the required values:**
   - Ask your team lead or project manager for the actual values for:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Replace the placeholder values in your `.env` file

## 📦 Step 4: Install Dependencies

Dependencies are like plugins that our project needs to work.

1. **In Terminal/Command Prompt, make sure you're in the project folder:**
   ```bash
   pwd  # Should show the path ending with "oneview-all-providers"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This might take a few minutes. You'll see lots of text scrolling by - that's normal!

## 🏃‍♀️ Step 5: Start the Development Server

Now we can run the project locally!

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Wait for the success message:**
   You should see something like:
   ```
   Local:   http://localhost:5173/
   Network: use --host to expose
   ```

3. **Open your web browser:**
   - Go to `http://localhost:5173/`
   - You should see the OneView application!

## 🎉 Congratulations!

You've successfully set up the project locally! Here's what you can do now:

### Making Changes
- Open files in Cursor
- Make your changes
- Save the file (`Cmd+S` or `Ctrl+S`)
- The browser will automatically refresh with your changes

### Getting Help
- **In Cursor:** Press `Cmd+K` (Mac) or `Ctrl+K` (Windows) to chat with AI
- **Ask questions like:**
  - "How do I change the color of this button?"
  - "Where is the login page code?"
  - "How do I add a new feature?"

### Common Commands
```bash
# Start the development server
npm run dev

# Stop the server (in Terminal/Command Prompt)
Ctrl+C

# Build for production
npm run build

# Check for errors
npm run typecheck
```

## 🆘 Troubleshooting

### "Command not found: npm"
- Make sure Node.js is installed correctly
- Try closing and reopening Terminal/Command Prompt

### "Cannot find module"
- Run `npm install` again
- Make sure you're in the project folder

### "Port already in use"
- The development server might already be running
- Look for another Terminal window with the server
- Or restart your computer

### Environment variables not working
- Make sure your `.env` file is in the project root
- Check that the variable names match exactly
- Restart the development server

## 📚 Next Steps

1. **Explore the codebase:**
   - Look at `src/components/` for UI components
   - Check `src/pages/` for different pages
   - Review `src/lib/` for utility functions

2. **Learn the basics:**
   - Ask Cursor AI about React concepts
   - Learn about TypeScript basics
   - Understand how the project structure works

3. **Start small:**
   - Try changing text in components
   - Modify colors in the CSS
   - Add simple features with AI help

## 🤝 Need More Help?

- **Ask Cursor AI:** It's your best friend for development questions
- **Team Chat:** Reach out to your development team
- **Documentation:** Check the project's internal docs in the `docs/` folder

Remember: Everyone starts somewhere! Don't hesitate to ask questions and use AI assistance. The more you practice, the more comfortable you'll become with development.

---

**Happy coding! 🚀** 