import { Navigate, Route, Routes } from "react-router-dom";
import { DataPrivacyPage } from "./pages/DataPrivacyPage";
import { DesignReferencePage } from "./pages/DesignReferencePage";
import { GoalSelectPage } from "./pages/GoalSelectPage";
import { CompanyInformationPage } from "./pages/CompanyInformationPage";
import { DataManagementSyncPage } from "./pages/DataManagementSyncPage";
import { RolesPermissionsPage } from "./pages/RolesPermissionsPage";
import { SettingsTriggerNotificationsPage } from "./pages/SettingsTriggerNotificationsPage";
import { SettingsBillingPage } from "./pages/SettingsBillingPage";
import { SettingsPlaceholderPage } from "./pages/SettingsPlaceholderPage";
import { SettingsSecurityPage } from "./pages/SettingsSecurityPage";
import { SettingsHelpSupportPage } from "./pages/SettingsHelpSupportPage";
import { SettingsProfilePage } from "./pages/SettingsProfilePage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { OnboardingLearningPage } from "./pages/OnboardingLearningPage";
import { OnboardingOptOutConfirmPage } from "./pages/OnboardingOptOutConfirmPage";
import { OnboardingTrainingPage } from "./pages/OnboardingTrainingPage";
import { TriggerNotificationsPage } from "./pages/TriggerNotificationsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EmployeePortalPage } from "./pages/EmployeePortalPage";
import { EmployeeProfilePage } from "./pages/EmployeeProfilePage";
import { SignDocumentsPage } from "./pages/SignDocumentsPage";
import { CreateDocumentBrowseTemplatesPage } from "./pages/CreateDocumentBrowseTemplatesPage";
import { CreateDocumentAiPreviewPage } from "./pages/CreateDocumentAiPreviewPage";
import { CreateDocumentManualPreviewPage } from "./pages/CreateDocumentManualPreviewPage";
import { CreateDocumentDocumentEditPage } from "./pages/CreateDocumentDocumentEditPage";
import { CreateDocumentDraftPage } from "./pages/CreateDocumentDraftPage";
import { CreateDocumentMethodPage } from "./pages/CreateDocumentMethodPage";
import { CreateDocumentSelectTemplatePage } from "./pages/CreateDocumentSelectTemplatePage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { HiringApplicantDetailPage } from "./pages/HiringApplicantDetailPage";
import { HiringApplicantsPage } from "./pages/HiringApplicantsPage";
import { HiringPage } from "./pages/HiringPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { WelcomePage } from "./pages/WelcomePage";
import { SettingsLayout } from "./layouts/SettingsLayout";
import { WorkspaceLayout } from "./layouts/WorkspaceLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/onboarding/goal" element={<GoalSelectPage />} />
      <Route path="/onboarding/privacy" element={<DataPrivacyPage />} />
      <Route path="/onboarding/learning" element={<OnboardingLearningPage />} />
      <Route
        path="/onboarding/opt-out-confirm"
        element={<OnboardingOptOutConfirmPage />}
      />
      <Route path="/onboarding/training" element={<OnboardingTrainingPage />} />
      <Route
        path="/onboarding/notifications"
        element={<TriggerNotificationsPage />}
      />
      <Route path="/design-reference" element={<DesignReferencePage />} />
      <Route element={<WorkspaceLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/employees/:employeeId" element={<EmployeeProfilePage />} />
        <Route path="/dashboard/employees" element={<EmployeePortalPage />} />
        <Route path="/dashboard/sign-documents" element={<SignDocumentsPage />} />
        <Route path="/hiring/jobs/:jobId/applicants/:applicantId" element={<HiringApplicantDetailPage />} />
        <Route path="/hiring/jobs/:jobId" element={<HiringApplicantsPage />} />
        <Route path="/hiring" element={<HiringPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route
          path="/create-document/template"
          element={<CreateDocumentSelectTemplatePage />}
        />
        <Route
          path="/create-document/templates/:categoryId"
          element={<CreateDocumentBrowseTemplatesPage />}
        />
        <Route path="/create-document/method" element={<CreateDocumentMethodPage />} />
        <Route path="/create-document/draft" element={<CreateDocumentDraftPage />} />
        <Route path="/create-document/ai-preview" element={<CreateDocumentAiPreviewPage />} />
        <Route path="/create-document/manual-preview" element={<CreateDocumentManualPreviewPage />} />
        <Route path="/create-document/document-edit" element={<CreateDocumentDocumentEditPage />} />
      </Route>
      <Route path="/settings" element={<SettingsLayout />}>
        <Route path="profile" element={<SettingsProfilePage />} />
        <Route path="company" element={<CompanyInformationPage />} />
        <Route path="roles" element={<RolesPermissionsPage />} />
        <Route path="billing" element={<SettingsBillingPage />} />
        <Route path="data" element={<DataManagementSyncPage />} />
        <Route path="trigger-notifications" element={<SettingsTriggerNotificationsPage />} />
        <Route
          path="employees"
          element={<SettingsPlaceholderPage title="Manage Employees" />}
        />
        <Route path="security" element={<SettingsSecurityPage />} />
        <Route path="help" element={<SettingsHelpSupportPage />} />
        <Route index element={<Navigate to="profile" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
