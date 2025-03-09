import React from "react";
import "./../styles/About.css";

const About = () => {
  return (
    <section className="about">
      <div className="about-container">
        <h2 className="about-title">نبذة عن المنصة</h2>

        <img
          src={require("./../images/about.png")}
          alt="About Us Illustration"
          className="about-image"
        />

        <p className="about-description">
          مرحبًا بك في منصتنا! نحن ملتزمون بتوفير بيئة تعليمية مبتكرة تُساعد
          الطلاب على التفوق وتحقيق أحلامهم. توفر المنصة مصادر تعليمية موثوقة
          وأدوات تفاعلية تُسهم في تعزيز تجربة التعلم.
        </p>

        <p className="about-description">
          رؤيتنا هي بناء مجتمع تعليمي متكامل حيث يمكن للطلاب والمعلم التواصل
          والمشاركة لتحسين جودة التعليم. نسعى إلى توفير أفضل الحلول الذكية
          لتحقيق ذلك.
        </p>
      </div>
    </section>
  );
};

export default About;
