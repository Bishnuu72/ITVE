import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../context/ProtectedRoute";
// Pages
import Home from "../pages/Home";
import About from "../pages/About";
import RuleRegulation from "../pages/RuleRegulation";
import CategoryDetails from "../pages/CategoryDetails";
import CourseDetail from "../pages/CourseDetail";
import Gallery from "../pages/Gallery";
import Download from "../pages/Download";
import Contact from "../pages/Contact";
import Feedback from "../pages/Feedback";
import Verify from "../pages/Verify";
import Login from "../pages/Login";
import Register from "../pages/RegisterPage";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import CenterList from "../pages/CenterList";
import AffiliationProcess from "../pages/AffiliationProcess";
import CenterApplyForm from "../pages/CenterApplyForm";
import StudentAdmission from "../pages/StudentAdmission";
import StudentVerification from "../pages/StudentVerification";
import StudentRegistrationProcess from "../pages/StudentRegistrationProcess";
import DownloadAdmitCard from "../pages/DownloadAdmitCard";
import StudentResult from "../pages/StudentResult";
import CertificateVerify from "../pages/CertificateVerify";
import TrainingPlacement from "../pages/TrainingPlacement";
import ApplyForJob from "../pages/ApplyForJob";
import Blog from "../pages/Blog";
import BlogDetail from "../pages/BlogDetail";
import RefundPolicy from "../pages/RefundPolicy";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndCondition from "../pages/TermsAndCondition";
import StudentDashboard from "../pages/StudentDashboard";
import CoursesPreview from "../components/home/CoursesPreview";





// Components
import CourseList from "../components/courses/CourseList";
import CategoryList from "../components/courses/CategoryList";
import CourseCategory from "../components/courses/CategoryList";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/rule-regulation" element={<RuleRegulation />} /> 

      {/* Course Routes */}
     <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute roles={["student"]}>
            <StudentDashboard/>
          </ProtectedRoute>
        }
      />
     <Route path="/category-details/:id" element={<CategoryDetails />} />
 
      <Route path="/courses/:id" element={<CourseDetail />} /> {/* Individual course detail */}
      <Route path="/course-list" element={<CourseList />} /> {/* Optional */}
      <Route path="/category-list" element={<CourseCategory />}/>
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/download" element={<Download />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/center-list" element={<CenterList />} />
      <Route path="/affiliation-process" element={<AffiliationProcess />} />
      <Route path="/center-apply-form" element={<CenterApplyForm />} />
      <Route path="/student-admission" element={<StudentAdmission />} />
      <Route path="/student-verification" element={<StudentVerification />} />
      <Route path="/student-registration-process" element={<StudentRegistrationProcess />} />
      <Route path="/download-admit-card" element={<DownloadAdmitCard />} />
      <Route path="/student-result" element={<StudentResult />} />
      <Route path="/certificate-verify" element={<CertificateVerify />} />
      <Route path="/training-placement" element={<TrainingPlacement />} />
      <Route path="/apply-for-job" element={<ApplyForJob />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog-detail/:id" element={<BlogDetail />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsAndCondition />} />
      <Route path="/course-preview" element={<CoursesPreview />} />




      {/* Fallback route */}
      {/* <Route path="*" element={<p>Page not found</p>} /> */}
    </Routes>
  );
}
