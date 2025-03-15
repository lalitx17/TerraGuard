# TerraGuard

## 🚀 What It Does

TerraGuard is a cloud security automation tool that:

- Imports cloud configurations and scans for security misconfigurations.
- Runs static security tests using **tfsec** to detect issues in Infrastructure as Code (IaC).
- Uses **AI-powered debugging**, providing intelligent suggestions and fixes instead of just reporting errors.

---


## 🛠 Built With

- [LangChain](https://www.langchain.com/)
- [Mistral](https://mistral.ai/)
- [Next.js](https://nextjs.org/)
- [Ollama](https://ollama.ai/)
- [Prisma](https://www.prisma.io/)
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [TanStack React Query](https://tanstack.com/query/latest)
- [Terraform](https://www.terraform.io/)
- [Terraformer](https://github.com/GoogleCloudPlatform/terraformer)
- [TypeScript](https://www.typescriptlang.org/)

---

## 🏗️ Installation

To install and set up TerraGuard locally, follow these steps:

### Prerequisites
- Node.js (>= 16.x)
- npm or yarn
- Docker (optional, for containerized deployment)
- Terraform (for IaC scanning)
- Terraformer (for importing cloud configurations)


### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/lalitx17/terraguard.git
   cd terraguard
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```

3. **Set up environment variables:**
   Copy the `.env.example` file and rename it to `.env`, then update the necessary values.

4. **Start the development server:**
   ```sh
   npm run dev
   ```
   or
   ```sh
   yarn dev
   ```

5. **Build for production:**
   ```sh
   npm run build
   ```
   or
   ```sh
   yarn build
   ```

6. **Run the production server:**
   ```sh
   npm start
   ```
   or
   ```sh
   yarn start
   ```

---

## 🏃 How to Run It Locally

After installation, you can run TerraGuard locally by:

```sh
npm run dev
```
Or, if using yarn:
```sh
yarn dev
```
