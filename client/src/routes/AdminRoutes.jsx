import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../context/ProtectedRoute";
// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import CenterDashboard from "../pages/admin/CenterDashboard";
import AddStudent from "../pages/admin/AddStudent";
import AllStudent from "../pages/admin/AllStudent";
import DeletedStudent from "../pages/admin/DeletedStudent";
import OnlineRegisteredStudent from "../pages/admin/OnlineRegisteredStudent";
import ViewStudentDetail from "../pages/admin/ViewStudentDetail";
import UpdateStudent from "../pages/admin/UpdateStudent";
import DownloadAdmitList from "../pages/admin/DownloadAdmitList";
import UpdateAdmit from "../pages/admin/UpdateAdmit";
import UpdateMarksList from "../pages/admin/UpdateMarksList";
import UpdateMarks from "../pages/admin/UpdateMarks";
import ViewMarksList from "../pages/admin/ViewMarksList";
import MarksDetail from "../pages/admin/MarksDetail";
import CertificateIssuedList from "../pages/admin/CertificateIssuedList";
import CategoryList from "../pages/admin/CategoryList";
import AddCategory from "../pages/admin/AddCategory";
import AddCourse from "../pages/admin/AddCourse";
import DeletedCategories from "../pages/admin/DeletedCategory";
import CourseList from "../pages/admin/CourseList";
import CourseDetail from "../pages/admin/CourseDetail";
import DeletedCourse from "../pages/admin/DeletedCourse";
import AddCentre from "../pages/admin/AddCentre";
import CentreList from "../pages/admin/CenterList";
import DeletedCentreList from "../pages/admin/DeleteCenterList";
import CentreRenewalList from "../pages/admin/CentreRenewalList";
import AddCentreRenewal from "../pages/admin/AddCentreRenewal";
import OnlineRegisteredCentre from "../pages/admin/OnlineRegisteredCentre";
import EnquiryList from "../pages/admin/EnquiryList";
import NoticeList from "../pages/admin/NoticeList";
import AddFee from "../pages/admin/AddFee";
import FeeList from "../pages/admin/FeeList";
import QRBalanceList from "../pages/admin/QRBalanceList";
import AddQRBalanceCode from "../pages/admin/AddQRBalance";
import OfflineBalanceList from "../pages/admin/OfflineBalanceList";
import AddOfflineBalance from "../pages/admin/AddOfflineBalance";
import TransactionHistory from "../pages/admin/TransactionHistory";
import OrderList from "../pages/admin/OrderList";
import TrackDelivery from "../pages/admin/TrackDelivery";
import AddDownload from "../pages/admin/AddDownload";
import DownloadList from "../pages/admin/DownloadList";
import AddBook from "../pages/admin/AddBook";
import BookList from "../pages/admin/BookList";
import JobList from "../pages/admin/JobList";
import JobDetail from "../pages/admin/JobDetail";
import CenterEnquiryList from "../pages/admin/CenterEnquiryList";
import ManagePage from "../pages/admin/ManagePage";
import AddPage from "../pages/admin/AddPage";
import ManageSlider from "../pages/admin/ManageSlider";
import AddSlider from "../pages/admin/AddSlider";
import ManageNotice from "../pages/admin/ManageNotice";
import AddNotice from "../pages/admin/AddNotice";
import GalleryList from "../pages/admin/GalleryList";
import AddGallery from "../pages/admin/AddGallery";
import TeamList from "../pages/admin/TeamList";
import AddTeam from "../pages/admin/AddTeam";
import TestimonialList from "../pages/admin/TestimonialList";
import AddTestimonial from "../pages/admin/AddTestimonial";
import BlogCategoryList from "../pages/admin/BlogCategoryList";
import AddBlogCategory from "../pages/admin/AddBlogCategory";
import BlogList from "../pages/admin/BlogList";
import AddBlog from "../pages/admin/AddBlog";
import OnlineExamList from "../pages/admin/OnlineExamList";
import AddOnlineExam from "../pages/admin/AddOnlineExam";
import PracticalExamResultList from "../pages/admin/PracticalExamResultList";
import MainExamResultList from "../pages/admin/MainExamResultList";
import LiveClassList from "../pages/admin/LiveClassList";
import AddLiveClass from "../pages/admin/AddLiveClass";
import MessageList from "../pages/admin/MessageList";
import AddMessage from "../pages/admin/AddMessage";
import DeliveryList from "../pages/admin/DeliveryList";
import AddDelivery from "../pages/admin/AddDelivery";
import ChangePassword from "../pages/admin/ChangePassword";
import Setting from "../pages/admin/Setting";
import AddQRBalance from "../pages/admin/AddQRBalance";
import ViewPdfCourse from "../pages/admin/ViewPdfCourse";
import ViewCentre from "../pages/admin/ViewCentre";
import UpdateCentre from "../pages/admin/UpdateCentre";

// Example role-based auth function


export default function AdminRoutes() {


  return (
    <Routes>

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/center-dashboard"
        element={
          <ProtectedRoute roles={[ "center"]}>
            <CenterDashboard />
          </ProtectedRoute>
        }
      />
      

      {/* student feature pages */}
      <Route path="/add-students" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddStudent />
        </ProtectedRoute>
      }
      />

      <Route path="/all-students" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AllStudent />
        </ProtectedRoute>
      }
      />

      <Route path="/deleted-students" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <DeletedStudent />
        </ProtectedRoute>
      }
      />

      <Route path="/online-registered-students" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <OnlineRegisteredStudent />
        </ProtectedRoute>
      } />
      <Route path="/view-student/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <ViewStudentDetail />
        </ProtectedRoute>
      }
      />

      <Route path="/update-student/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <UpdateStudent />
        </ProtectedRoute>
      }
      />
      {/* exam & marks feature pages */}
      <Route path="/download-admit" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <DownloadAdmitList />
        </ProtectedRoute>
      } />
      <Route path="/update-admit/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <UpdateAdmit />
        </ProtectedRoute>
      }
      />
      <Route path="/update-marks-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <UpdateMarksList />
        </ProtectedRoute>
      }
      />
      <Route path="/update-marks/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <UpdateMarks />
        </ProtectedRoute>
      }
      />
      <Route path="/view-marks-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <ViewMarksList />
        </ProtectedRoute>
      }
      />
      <Route path="/marks-detail/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <MarksDetail />
        </ProtectedRoute>
      }
      />
      <Route path="/certificate-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <CertificateIssuedList />
        </ProtectedRoute>
      }
      />
      {/* Course*/}
      <Route path="/category-lists" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <CategoryList />
        </ProtectedRoute>
      }
      />
      <Route path="/add-category" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddCategory />
        </ProtectedRoute>
      }
      />
      <Route path="/edit-category/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddCategory />
        </ProtectedRoute>
      }
      />

      <Route path="/course-pdf/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <ViewPdfCourse />
        </ProtectedRoute>
      }
      />

      <Route path="/add-course" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddCourse />
        </ProtectedRoute>
      }
      />
      <Route path="/course-lists" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <CourseList />
        </ProtectedRoute>
      }
      />
      <Route path="/course-detail/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <CourseDetail />
        </ProtectedRoute>
      }
      />
      <Route path="/delete-course" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <DeletedCourse />
        </ProtectedRoute>
      }
      />
      <Route path="/delete-category" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <DeletedCategories />
        </ProtectedRoute>
      }
      />
      {/* Center */}
      <Route path="/add-center" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddCentre />
        </ProtectedRoute>
      }
      />
      <Route path="/center-lists" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <CentreList />
        </ProtectedRoute>
      }
      />
      <Route path="/delete-center-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <DeletedCentreList />
        </ProtectedRoute>
      }
      />
      <Route path="/view-centre/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <ViewCentre />
        </ProtectedRoute>
      }
      />
      <Route path="/update-centre/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <UpdateCentre />
        </ProtectedRoute>
      }
      />
      <Route path="/center-renewal-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <CentreRenewalList />
        </ProtectedRoute>
      }
      />
      <Route path="/add-center-renewal" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddCentreRenewal />
        </ProtectedRoute>
      }
      />
      <Route path="/online-registered-center" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <OnlineRegisteredCentre />
        </ProtectedRoute>
      }
      />
      <Route path="/enquiry-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <EnquiryList />
        </ProtectedRoute>
      }
      />
      <Route path="/notice-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <NoticeList />
        </ProtectedRoute>
      }
      />
      {/* Students Fee */}
      <Route path="/add-fee" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddFee />
        </ProtectedRoute>
      }
      />
      <Route path="/fee-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <FeeList />
        </ProtectedRoute>
      }
      />
      <Route path="/edit-fee/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddFee />
        </ProtectedRoute>
      }
      />

      {/* Payment and Earning */}
      <Route path="/qr-balance-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <QRBalanceList />
        </ProtectedRoute>
      }
      />
      <Route path="/add-qr-balance" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddQRBalance />
        </ProtectedRoute>
      }
      />
      <Route path="/edit-qr-balance/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddQRBalance />
        </ProtectedRoute>
      }
      />

      <Route path="/offline-balance-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <OfflineBalanceList />
        </ProtectedRoute>
      }
      />
      <Route path="/add-offline-balance" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddOfflineBalance />
        </ProtectedRoute>
      }
      />
      <Route path="/edit-offline-balance/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddOfflineBalance />
        </ProtectedRoute>
      }
      />
      <Route path="/transaction-history" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <TransactionHistory />
        </ProtectedRoute>
      }
      />
      {/* Order List */}
      <Route path="/order-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <OrderList />
        </ProtectedRoute>
      }
      />
      <Route path="/track-delivery" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <TrackDelivery />
        </ProtectedRoute>
      }
      />
      {/* Download */}
      <Route path="/add-download" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddDownload />
        </ProtectedRoute>
      }
      />
      <Route path="/download-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <DownloadList />
        </ProtectedRoute>
      }
      />
      {/* Library */}
      <Route path="/add-book" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddBook />
        </ProtectedRoute>
      }
      />
      <Route path="/add-book/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddBook />
        </ProtectedRoute>
      }
      />
      <Route path="/book-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <BookList />
        </ProtectedRoute>
      }
      />
      {/* Front Panel */}
      <Route path="/job-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <JobList />
        </ProtectedRoute>
      }
      />
      <Route path="/job-details/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <JobDetail />
        </ProtectedRoute>
      }
      />
      <Route path="/center-enquiry-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <CenterEnquiryList />
        </ProtectedRoute>
      }
      />
      <Route path="/manage-page" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <ManagePage />
        </ProtectedRoute>
      }
      />
      <Route path="/add-page" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddPage />
        </ProtectedRoute>
      }
      />
      <Route path="/edit-page/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddPage />
        </ProtectedRoute>
      }
      />

      <Route path="/manage-slider" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <ManageSlider />
        </ProtectedRoute>
      }
      />
      <Route path="/add-slider" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddSlider />
        </ProtectedRoute>
      }
      />
      <Route path="/edit-slider/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddSlider />
        </ProtectedRoute>
      }
      />


      <Route path="/manage-notice" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <ManageNotice />
        </ProtectedRoute>
      }
      />
      <Route path="/add-notice" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddNotice />
        </ProtectedRoute>
      }
      />
      <Route path="/edit-notice/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddNotice />
        </ProtectedRoute>
      }
      />

      <Route path="/gallery-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <GalleryList />
        </ProtectedRoute>
      }
      />
      <Route path="/add-gallery" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddGallery />
        </ProtectedRoute>
      }
      />
      <Route path="/edit-gallery/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddGallery />
        </ProtectedRoute>
      }
      />

      <Route path="/team-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <TeamList />
        </ProtectedRoute>
      }
      />
      <Route path="/add-team" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddTeam />
        </ProtectedRoute>
      }
      />
      <Route path="/edit-team/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddTeam />
        </ProtectedRoute>
      }
      />

      <Route path="/testimonial-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <TestimonialList />
        </ProtectedRoute>
      }
      />
      <Route path="/add-testimonial" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddTestimonial />
        </ProtectedRoute>
      }
      />
      <Route path="/blog-category-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <BlogCategoryList />
        </ProtectedRoute>
      }
      />
      <Route path="/add-blog-category" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddBlogCategory />
        </ProtectedRoute>
      }
      />
      <Route path="/edit-blog-category/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddBlogCategory />
        </ProtectedRoute>
      }
      />

      <Route path="/blog-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <BlogList />
        </ProtectedRoute>
      }
      />
      <Route path="/add-blog" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddBlog />
        </ProtectedRoute>
      }
      />
      <Route path="/edit-blog/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddBlog />
        </ProtectedRoute>
      }
      />
      {/* Online Exam */}
      <Route path="/online-exam-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <OnlineExamList />
        </ProtectedRoute>
      }
      />
      <Route path="/add-online-exam" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddOnlineExam />
        </ProtectedRoute>
      }
      />
      <Route path="/edit-online-exam/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddOnlineExam />
        </ProtectedRoute>
      }
      />
      <Route path="/practical-exam-result-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <PracticalExamResultList />
        </ProtectedRoute>
      }
      />
      <Route path="/main-exam-result-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <MainExamResultList />
        </ProtectedRoute>
      }
      />
      {/* Live Class*/}
      <Route path="/live-class-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <LiveClassList />
        </ProtectedRoute>
      }
      />
      <Route path="/add-live-class" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddLiveClass />
        </ProtectedRoute>
      }
      />
      <Route path="/add-live-class/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddLiveClass />
        </ProtectedRoute>
      }
      />
      {/* Message*/}
      <Route path="/message-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <MessageList />
        </ProtectedRoute>
      }
      />
      <Route path="/add-message" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddMessage />
        </ProtectedRoute>
      }
      />
      <Route path="/add-message/:id" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddMessage />
        </ProtectedRoute>
      }
      />
      {/* Delivery*/}
      <Route path="/delivery-list" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <DeliveryList />
        </ProtectedRoute>
      }
      />
      <Route path="/add-delivery" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <AddDelivery />
        </ProtectedRoute>
      }
      />
      {/* Setting */}
      <Route path="/setting" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <Setting />
        </ProtectedRoute>
      }
      />
      {/* Change Password */}
      <Route path="/change-password" element={
        <ProtectedRoute roles={["admin", "center"]}>
          <ChangePassword />
        </ProtectedRoute>
      }
      />
    </Routes>

  );
}
