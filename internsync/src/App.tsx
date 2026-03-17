import { Navigate, Route, Routes } from "react-router-dom"
import { DashboardPage } from "@/pages/DashboardPage"
import { ApplicationsPage } from "@/pages/ApplicationsPage"
import { CompaniesPage } from "@/pages/CompaniesPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { ApplicationDetailsPage } from "@/pages/ApplicationDetailsPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/applications" element={<ApplicationsPage />} />
      <Route path="/applications/:id" element={<ApplicationDetailsPage />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
