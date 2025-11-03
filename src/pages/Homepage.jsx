import './Homepage.css';  // 导入 CSS（即使空，也加）

function Homepage() {
  return (
    <div className="homepage-container">
      <h1>Welcome to Your Homepage!</h1>
      <p>This is the user's personalized dashboard. (To be implemented)</p>
      {/* 后期加事件列表、用户 info 等 */}
    </div>
  );
}

export default Homepage;  // 关键：默认导出！