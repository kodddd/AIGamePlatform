import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  GlobalOutlined,
  BookOutlined,
  PictureOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

const Document = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("world-expander");

  const renderContent = () => {
    switch (selectedMenu) {
      case "world-expander":
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              世界扩写引擎
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              将简要的世界观概念转化为完整的游戏世界设定和背景故事。
            </p>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              使用步骤：
            </h3>
            <ol className="space-y-3 text-base text-gray-700">
              <li className="ml-4">1. 在主页点击功能模块进入功能页面</li>
              <li className="ml-4">2. 导航至左侧菜单栏的"世界扩写引擎"选项</li>
              <li className="ml-4">3. 输入世界观描述</li>
              <li className="ml-4">4. 调整生成设置</li>
              <li className="ml-4">5. 点击"开始生成"按钮</li>
              <li className="ml-4">6. 生成完成后可以复制或保存</li>
            </ol>
          </div>
        );
      case "story-workshop":
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              动态剧情生成
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              基于游戏世界设定创建分支故事情节和叙事路径。
            </p>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              使用步骤：
            </h3>
            <ol className="space-y-3 text-base text-gray-700">
              <li className="ml-4">1. 在主页点击功能模块进入功能页面</li>
              <li className="ml-4">2. 导航至左侧菜单栏的"动态剧情生成"选项</li>
              <li className="ml-4">3. 从资源库导入世界观</li>
              <li className="ml-4">4. 输入剧情概要</li>
              <li className="ml-4">5. 调整生成设置</li>
              <li className="ml-4">6. 点击"开始生成"按钮</li>
              <li className="ml-4">7. 生成完成后可以复制或保存</li>
            </ol>
          </div>
        );
      case "visual-workshop":
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              AI视觉工坊
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              根据文字描述生成角色艺术和视觉资产。
            </p>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              使用步骤：
            </h3>
            <ol className="space-y-3 text-base text-gray-700">
              <li className="ml-4">1. 在主页点击功能模块进入功能页面</li>
              <li className="ml-4">2. 导航至左侧菜单栏的"AI视觉工坊"选项</li>
              <li className="ml-4">3. 从资源库导入世界观</li>
              <li className="ml-4">4. 输入角色描述</li>
              <li className="ml-4">5. 调整生成设置</li>
              <li className="ml-4">6. 点击"开始生成"按钮</li>
              <li className="ml-4">7. 生成完成后可以下载或保存</li>
            </ol>
          </div>
        );
      case "asset-library":
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              世界观资源库
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              集中管理所有创建的世界、角色和故事的中央存储库。
            </p>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              使用步骤：
            </h3>
            <ol className="space-y-3 text-base text-gray-700">
              <li className="ml-4">1. 在主页点击功能模块进入功能页面</li>
              <li className="ml-4">2. 导航至左侧菜单栏的"世界观资源库"选项</li>
              <li className="ml-4">3. 浏览已保存的世界观列表</li>
              <li className="ml-4">4. 编辑或删除已保存的世界观</li>
            </ol>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Menu
          theme="dark"
          defaultSelectedKeys={["world-expander"]}
          mode="inline"
          onSelect={({ key }) => setSelectedMenu(key)}
        >
          <Menu.Item key="world-expander" icon={<GlobalOutlined />}>
            世界扩写引擎
          </Menu.Item>
          <Menu.Item key="story-workshop" icon={<BookOutlined />}>
            动态剧情生成
          </Menu.Item>
          <Menu.Item key="visual-workshop" icon={<PictureOutlined />}>
            AI视觉工坊
          </Menu.Item>
          <Menu.Item key="asset-library" icon={<DatabaseOutlined />}>
            世界观资源库
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: "0 16px" }}>
          <div style={{ padding: 24, minHeight: 360 }}>{renderContent()}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Document;
