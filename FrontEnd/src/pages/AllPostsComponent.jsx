import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../styles/dashboard/posts.css";
import Loader from "./Loader";

const AllPostsComponent = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState([]);
  const [editStages, setEditStages] = useState({
    stage_one: false,
    stage_two: false,
    stage_three: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(true);

  // List of subjects
  const subjects = [
    { label: "تاريخ", value: "تاريخ" },
    { label: "لغة فرنسية", value: "فرنسي" },
    { label: "لغة انجليزية", value: "انجليزي" },
    {
      label: "رياضيات",
      options: [
        { label: "جبر", value: "جبر" },
        { label: "هندسة", value: "هندسة" },
        { label: "تفاضل", value: "تفاضل" },
        { label: "مثلثات", value: "مثلثات" },
        { label: "إحصاء", value: "إحصاء" },
      ],
    },
  ];

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("لم يتم العثور على رمز الوصول. الرجاء تسجيل الدخول.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/announcements`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("حدث خطأ أثناء تحميل الإعلانات.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Function to view post details
  const viewPostDetails = (post) => {
    setSelectedPost(post);
    setEditingPost(null); // Exit editing mode
    setEditSubject(post.subject);
  };

  // Function to open edit mode
  const editPost = (post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.description);
    setEditStages({
      stage_one: post.stage.includes("أولى ثانوي"),
      stage_two: post.stage.includes("ثانية ثانوي"),
      stage_three: post.stage.includes("ثالثة ثانوي"),
    });
    setSelectedPost(null); // Exit details view
    setEditSubject(post.subject);
  };

  // Function to handle subject toggle in edit mode
  const handleSubjectToggle = (subject) => {
    setEditSubject((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  // Function to save edited post
  const saveEditPost = async () => {
    if (!editTitle.trim() || !editContent.trim() || editSubject.length === 0) {
      toast.error("العنوان ومحتوى الإعلان لا يمكن أن يكونا فارغين!");
      return;
    }

    // Check if at least one stage is selected
    if (
      !editStages.stage_one &&
      !editStages.stage_two &&
      !editStages.stage_three
    ) {
      toast.error("يجب اختيار مرحلة دراسية واحدة على الأقل!");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    try {
      // Update the announcement on the server
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/announcements/${editingPost._id}`,
        {
          title: editTitle,
          description: editContent,
          stage: [
            editStages.stage_one ? "أولى ثانوي" : null,
            editStages.stage_two ? "ثانية ثانوي" : null,
            editStages.stage_three ? "ثالثة ثانوي" : null,
          ].filter(Boolean),
          subject: editSubject,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the announcement locally
      setPosts(
        posts.map((post) =>
          post._id === editingPost._id
            ? {
                ...post,
                title: response.data.title,
                description: response.data.description,
                stage: response.data.stage,
                subject: response.data.subject,
              }
            : post
        )
      );
      toast.success("تم تحديث الإعلان بنجاح!");
      setEditingPost(null);
      setSelectedPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
        toast.error(
          `خطأ: ${error.response.data.message || "حدث خطأ أثناء التحديث."}`
        );
      } else {
        toast.error("حدث خطأ أثناء تحديث الإعلان.");
      }
    }
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setEditingPost(null);
    setEditTitle("");
    setSelectedPost("");
    setEditContent("");
    setEditStages({
      stage_one: false,
      stage_two: false,
      stage_three: false,
    });
    setEditSubject([]);
    toast.info("تم إلغاء التعديلات.");
  };

  // Function to delete a post
  const deletePost = async (id) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا الإعلان؟");
    if (confirmed) {
      const accessToken = localStorage.getItem("accessToken");

      try {
        // Delete the announcement from the server
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/announcements/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Remove the announcement locally
        setPosts(posts.filter((post) => post._id !== id));
        if (selectedPost && selectedPost._id === id) {
          setSelectedPost(null);
        }
        if (editingPost && editingPost._id === id) {
          setEditingPost(null);
        }
        toast.success("تم حذف الإعلان بنجاح!");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("حدث خطأ أثناء حذف الإعلان.");
      }
    }
  };

  // Function to filter posts based on search term and subject
  const filteredPosts = posts.filter(
    (post) =>
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSubject === "" ||
        post.subject.some((sub) => sub.includes(selectedSubject)))
  );

  return (
    <div className="all-posts-component">
      <ToastContainer />

      <header className="posts-header">
        <h2>إدارة الإعلانات</h2>
        <input
          type="text"
          placeholder="ابحث عن إعلان..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="subject-dropdown"
        >
          <option value="">كل المواد</option>
          <option value="فرنسي">لغة فرنسية</option>
          <option value="انجليزي">لغة انجليزية</option>
          <option value="تاريخ">تاريخ</option>
          <optgroup label="رياضيات">
            <option value="جبر">جبر</option>
            <option value="هندسة">هندسة</option>
            <option value="تفاضل">تفاضل</option>
            <option value="مثلثات">مثلثات</option>
            <option value="إحصاء">إحصاء</option>
          </optgroup>
        </select>
      </header>

      <div className="posts-container">
        {loading ? (
          <Loader />
        ) : (
          <ul className="posts-list">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <li key={post._id} className="post-item">
                  <div className="post-content">
                    <h4>{post.title}</h4>
                    <h5>{post.subject.join(", ")}</h5>
                    <ul>
                      {post.stage.map((stage, index) => (
                        <li key={index}>المرحلة الدراسية: {stage}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="post-actions">
                    <button
                      className="view-post-btn"
                      onClick={() => viewPostDetails(post)}
                    >
                      عرض التفاصيل
                    </button>
                    <button
                      className="edit-post-btn"
                      onClick={() => editPost(post)}
                    >
                      تعديل
                    </button>
                    <button
                      className="delete-post-btn"
                      onClick={() => deletePost(post._id)}
                    >
                      حذف
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="no-posts-message">لا توجد إعلانات مطابقة للبحث.</p>
            )}
          </ul>
        )}

        {/* View Post Details */}
        {selectedPost && (
          <div className="post-details">
            <h3>تفاصيل الإعلان</h3>
            <h4>{selectedPost.title}</h4>
            <p>{selectedPost.description}</p>
            <div className="details-section">
              <h5>المراحل الدراسية:</h5>
              <ul>
                {selectedPost.stage.map((stage, index) => (
                  <li key={index}>{stage}</li>
                ))}
              </ul>
            </div>
            <div className="details-section">
              <h5>المواد:</h5>
              <ul>
                {selectedPost.subject.map((sub, index) => (
                  <li key={index}>{sub}</li>
                ))}
              </ul>
            </div>
            <button
              className="close-details-btn"
              onClick={() => setSelectedPost(null)}
            >
              إغلاق
            </button>
          </div>
        )}

        {/* Edit Post */}
        {editingPost && (
          <div className="post-edit">
            <h3>تعديل محتوى الإعلان</h3>
            <div className="edit-section">
              <label>عنوان الإعلان:</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="عنوان الإعلان"
                className="edit-title-input"
              />
            </div>
            <div className="edit-section">
              <label>تفاصيل الإعلان:</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="edit-textarea"
              />
            </div>
            <div className="edit-section">
              <h4>المراحل الدراسية</h4>
              <label>
                <input
                  type="checkbox"
                  checked={editStages.stage_one}
                  onChange={(e) =>
                    setEditStages({
                      ...editStages,
                      stage_one: e.target.checked,
                    })
                  }
                />
                أولى ثانوي
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={editStages.stage_two}
                  onChange={(e) =>
                    setEditStages({
                      ...editStages,
                      stage_two: e.target.checked,
                    })
                  }
                />
                ثانية ثانوي
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={editStages.stage_three}
                  onChange={(e) =>
                    setEditStages({
                      ...editStages,
                      stage_three: e.target.checked,
                    })
                  }
                />
                ثالثة ثانوي
              </label>
            </div>
            <div className="edit-section">
              <h4>المواد الدراسية</h4>
              {subjects.map((subjectGroup) =>
                subjectGroup.options ? (
                  <div key={subjectGroup.value} className="checkbox-item">
                    <h5>{subjectGroup.label}</h5>
                    {subjectGroup.options.map((option) => (
                      <label key={option.value}>
                        <input
                          type="checkbox"
                          checked={editSubject.includes(option.value)}
                          onChange={() => handleSubjectToggle(option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                ) : (
                  <label key={subjectGroup.value} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={editSubject.includes(subjectGroup.value)}
                      onChange={() => handleSubjectToggle(subjectGroup.value)}
                    />
                    {subjectGroup.label}
                  </label>
                )
              )}
            </div>
            <div className="edit-actions">
              <button className="save-edit-btn" onClick={saveEditPost}>
                حفظ
              </button>
              <button className="cancel-edit-btn" onClick={cancelEdit}>
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPostsComponent;
