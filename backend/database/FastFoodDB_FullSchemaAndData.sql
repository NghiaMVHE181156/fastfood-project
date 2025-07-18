USE [Fast_Food_db]
GO
ALTER TABLE [dbo].[User] DROP CONSTRAINT [CK__User__status__3A81B327]
GO
ALTER TABLE [dbo].[User] DROP CONSTRAINT [CK__User__gender__38996AB5]
GO
ALTER TABLE [dbo].[Shipping] DROP CONSTRAINT [CK_Shipping_CurrentStatus]
GO
ALTER TABLE [dbo].[Payment] DROP CONSTRAINT [CK_Payment_PaymentMethod]
GO
ALTER TABLE [dbo].[Payment] DROP CONSTRAINT [CK__Payment__status__5629CD9C]
GO
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [CK_Order_PaymentMethod]
GO
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [CK__Order__status__4CA06362]
GO
ALTER TABLE [dbo].[DeliveryLog] DROP CONSTRAINT [CK__DeliveryL__statu__5BE2A6F2]
GO
ALTER TABLE [dbo].[Shipping] DROP CONSTRAINT [FK_Shipping_Shipper]
GO
ALTER TABLE [dbo].[Shipping] DROP CONSTRAINT [FK_Shipping_Order]
GO
ALTER TABLE [dbo].[Payment] DROP CONSTRAINT [FK_Payment_Order]
GO
ALTER TABLE [dbo].[OrderItem] DROP CONSTRAINT [FK_OrderItem_Order]
GO
ALTER TABLE [dbo].[OrderItem] DROP CONSTRAINT [FK_OrderItem_Dish]
GO
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [FK_Order_User]
GO
ALTER TABLE [dbo].[FailedDelivery] DROP CONSTRAINT [FK_FailedDelivery_Order]
GO
ALTER TABLE [dbo].[Dish] DROP CONSTRAINT [FK_Dish_Category]
GO
ALTER TABLE [dbo].[DeliveryLog] DROP CONSTRAINT [FK_DeliveryLog_Order]
GO
ALTER TABLE [dbo].[User] DROP CONSTRAINT [DF__User__created_at__3C69FB99]
GO
ALTER TABLE [dbo].[User] DROP CONSTRAINT [DF__User__boom_count__3B75D760]
GO
ALTER TABLE [dbo].[User] DROP CONSTRAINT [DF__User__status__398D8EEE]
GO
ALTER TABLE [dbo].[Shipper] DROP CONSTRAINT [DF__Shipper__created__440B1D61]
GO
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [DF__Order__updated_a__5070F446]
GO
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [DF__Order__created_a__4F7CD00D]
GO
ALTER TABLE [dbo].[Order] DROP CONSTRAINT [DF__Order__payment_m__4D94879B]
GO
ALTER TABLE [dbo].[Dish] DROP CONSTRAINT [DF__Dish__is_availab__49C3F6B7]
GO
/****** Object:  Index [UQ__User__B43B145F95039294]    Script Date: 18/07/2025 12:00:37 SA ******/
ALTER TABLE [dbo].[User] DROP CONSTRAINT [UQ__User__B43B145F95039294]
GO
/****** Object:  Index [UQ__User__AB6E6164069B3EB1]    Script Date: 18/07/2025 12:00:37 SA ******/
ALTER TABLE [dbo].[User] DROP CONSTRAINT [UQ__User__AB6E6164069B3EB1]
GO
/****** Object:  Index [UQ__Shipper__B43B145FC55337E1]    Script Date: 18/07/2025 12:00:37 SA ******/
ALTER TABLE [dbo].[Shipper] DROP CONSTRAINT [UQ__Shipper__B43B145FC55337E1]
GO
/****** Object:  Index [UQ__Shipper__AB6E616404797205]    Script Date: 18/07/2025 12:00:37 SA ******/
ALTER TABLE [dbo].[Shipper] DROP CONSTRAINT [UQ__Shipper__AB6E616404797205]
GO
/****** Object:  Index [UQ__Category__72E12F1B68F666CD]    Script Date: 18/07/2025 12:00:37 SA ******/
ALTER TABLE [dbo].[Category] DROP CONSTRAINT [UQ__Category__72E12F1B68F666CD]
GO
/****** Object:  Index [UQ__Admin__AB6E6164DF1D014A]    Script Date: 18/07/2025 12:00:37 SA ******/
ALTER TABLE [dbo].[Admin] DROP CONSTRAINT [UQ__Admin__AB6E6164DF1D014A]
GO
/****** Object:  Table [dbo].[User]    Script Date: 18/07/2025 12:00:37 SA ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[User]') AND type in (N'U'))
DROP TABLE [dbo].[User]
GO
/****** Object:  Table [dbo].[Shipping]    Script Date: 18/07/2025 12:00:37 SA ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Shipping]') AND type in (N'U'))
DROP TABLE [dbo].[Shipping]
GO
/****** Object:  Table [dbo].[Shipper]    Script Date: 18/07/2025 12:00:37 SA ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Shipper]') AND type in (N'U'))
DROP TABLE [dbo].[Shipper]
GO
/****** Object:  Table [dbo].[RevenueReport]    Script Date: 18/07/2025 12:00:37 SA ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RevenueReport]') AND type in (N'U'))
DROP TABLE [dbo].[RevenueReport]
GO
/****** Object:  Table [dbo].[Payment]    Script Date: 18/07/2025 12:00:37 SA ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Payment]') AND type in (N'U'))
DROP TABLE [dbo].[Payment]
GO
/****** Object:  Table [dbo].[OrderItem]    Script Date: 18/07/2025 12:00:37 SA ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OrderItem]') AND type in (N'U'))
DROP TABLE [dbo].[OrderItem]
GO
/****** Object:  Table [dbo].[Order]    Script Date: 18/07/2025 12:00:37 SA ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Order]') AND type in (N'U'))
DROP TABLE [dbo].[Order]
GO
/****** Object:  Table [dbo].[FailedDelivery]    Script Date: 18/07/2025 12:00:37 SA ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[FailedDelivery]') AND type in (N'U'))
DROP TABLE [dbo].[FailedDelivery]
GO
/****** Object:  Table [dbo].[Dish]    Script Date: 18/07/2025 12:00:37 SA ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Dish]') AND type in (N'U'))
DROP TABLE [dbo].[Dish]
GO
/****** Object:  Table [dbo].[DeliveryLog]    Script Date: 18/07/2025 12:00:37 SA ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DeliveryLog]') AND type in (N'U'))
DROP TABLE [dbo].[DeliveryLog]
GO
/****** Object:  Table [dbo].[Category]    Script Date: 18/07/2025 12:00:37 SA ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Category]') AND type in (N'U'))
DROP TABLE [dbo].[Category]
GO
/****** Object:  Table [dbo].[Admin]    Script Date: 18/07/2025 12:00:37 SA ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Admin]') AND type in (N'U'))
DROP TABLE [dbo].[Admin]
GO
USE [master]
GO
/****** Object:  Database [Fast_Food_db]    Script Date: 18/07/2025 12:00:37 SA ******/
DROP DATABASE [Fast_Food_db]
GO
/****** Object:  Database [Fast_Food_db]    Script Date: 18/07/2025 12:00:37 SA ******/
CREATE DATABASE [Fast_Food_db]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Fast_Food_db', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.JONNYTRAN\MSSQL\DATA\Fast_Food_db.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Fast_Food_db_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.JONNYTRAN\MSSQL\DATA\Fast_Food_db_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [Fast_Food_db] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Fast_Food_db].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Fast_Food_db] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Fast_Food_db] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Fast_Food_db] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Fast_Food_db] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Fast_Food_db] SET ARITHABORT OFF 
GO
ALTER DATABASE [Fast_Food_db] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [Fast_Food_db] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Fast_Food_db] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Fast_Food_db] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Fast_Food_db] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Fast_Food_db] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Fast_Food_db] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Fast_Food_db] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Fast_Food_db] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Fast_Food_db] SET  ENABLE_BROKER 
GO
ALTER DATABASE [Fast_Food_db] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Fast_Food_db] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Fast_Food_db] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Fast_Food_db] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Fast_Food_db] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Fast_Food_db] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Fast_Food_db] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Fast_Food_db] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Fast_Food_db] SET  MULTI_USER 
GO
ALTER DATABASE [Fast_Food_db] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Fast_Food_db] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Fast_Food_db] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Fast_Food_db] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Fast_Food_db] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Fast_Food_db] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Fast_Food_db] SET QUERY_STORE = OFF
GO
USE [Fast_Food_db]
GO
/****** Object:  Table [dbo].[Admin]    Script Date: 18/07/2025 12:00:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Admin](
	[admin_id] [int] IDENTITY(1,1) NOT NULL,
	[user_name] [nvarchar](100) NULL,
	[email] [nvarchar](100) NULL,
	[password_hash] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[admin_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Category]    Script Date: 18/07/2025 12:00:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Category](
	[category_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NULL,
	[description] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[category_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DeliveryLog]    Script Date: 18/07/2025 12:00:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DeliveryLog](
	[log_id] [int] IDENTITY(1,1) NOT NULL,
	[order_id] [int] NULL,
	[status] [varchar](20) NULL,
	[timestamp] [datetime] NULL,
	[note] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[log_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Dish]    Script Date: 18/07/2025 12:00:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Dish](
	[dish_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NULL,
	[description] [nvarchar](max) NULL,
	[price] [int] NULL,
	[image_url] [nvarchar](255) NULL,
	[category_id] [int] NULL,
	[is_available] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[dish_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FailedDelivery]    Script Date: 18/07/2025 12:00:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FailedDelivery](
	[fail_id] [int] IDENTITY(1,1) NOT NULL,
	[order_id] [int] NULL,
	[attempt] [tinyint] NULL,
	[reason] [nvarchar](max) NULL,
	[logged_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[fail_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order]    Script Date: 18/07/2025 12:00:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order](
	[order_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NULL,
	[status] [varchar](20) NULL,
	[total_amount] [int] NULL,
	[payment_method] [varchar](10) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
	[address] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[order_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderItem]    Script Date: 18/07/2025 12:00:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderItem](
	[order_item_id] [int] IDENTITY(1,1) NOT NULL,
	[order_id] [int] NULL,
	[dish_id] [int] NULL,
	[quantity] [int] NULL,
	[unit_price] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[order_item_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Payment]    Script Date: 18/07/2025 12:00:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Payment](
	[payment_id] [int] IDENTITY(1,1) NOT NULL,
	[order_id] [int] NULL,
	[amount] [int] NULL,
	[payment_method] [varchar](10) NULL,
	[status] [varchar](10) NULL,
	[paid_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[payment_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RevenueReport]    Script Date: 18/07/2025 12:00:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RevenueReport](
	[report_id] [int] IDENTITY(1,1) NOT NULL,
	[date] [date] NULL,
	[total_orders] [int] NULL,
	[total_revenue] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[report_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Shipper]    Script Date: 18/07/2025 12:00:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Shipper](
	[shipper_id] [int] IDENTITY(1,1) NOT NULL,
	[user_name] [nvarchar](100) NULL,
	[full_name] [nvarchar](100) NULL,
	[phone] [nvarchar](15) NULL,
	[email] [nvarchar](100) NULL,
	[password_hash] [nvarchar](255) NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[shipper_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Shipping]    Script Date: 18/07/2025 12:00:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Shipping](
	[shipping_id] [int] IDENTITY(1,1) NOT NULL,
	[order_id] [int] NULL,
	[shipper_id] [int] NULL,
	[current_status] [varchar](20) NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[shipping_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 18/07/2025 12:00:38 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[user_name] [nvarchar](100) NULL,
	[email] [nvarchar](100) NULL,
	[full_name] [nvarchar](100) NULL,
	[phone] [nvarchar](15) NULL,
	[password_hash] [nvarchar](255) NULL,
	[address] [nvarchar](255) NULL,
	[avatar_url] [nvarchar](255) NULL,
	[gender] [varchar](10) NULL,
	[birthdate] [date] NULL,
	[status] [varchar](10) NULL,
	[is_flagged] [bit] NULL,
	[boom_count] [int] NULL,
	[note] [nvarchar](max) NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Admin] ON 

INSERT [dbo].[Admin] ([admin_id], [user_name], [email], [password_hash]) VALUES (1, N'admin_main', N'admin1@gmail.com', N'$2a$12$eWvk6uK4f9WfMjO8PgO6QOdvRAPNzB0pSf4YzEUjQT5cdf61uc2Dy')
INSERT [dbo].[Admin] ([admin_id], [user_name], [email], [password_hash]) VALUES (2, N'admin_sub', N'admin2@gmail.com', N'$2a$12$ratWL.ngPRhZtHo88CwSCe7vVHRY.On4I2lBu3WPEJLAV..mMnJza')
SET IDENTITY_INSERT [dbo].[Admin] OFF
GO
SET IDENTITY_INSERT [dbo].[Category] ON 

INSERT [dbo].[Category] ([category_id], [name], [description]) VALUES (1, N'Cơm', N'Các món cơm truyền thống như cơm tấm, cơm gà xối mỡ')
INSERT [dbo].[Category] ([category_id], [name], [description]) VALUES (2, N'Mì', N'Các món mì đặc sắc')
INSERT [dbo].[Category] ([category_id], [name], [description]) VALUES (3, N'Nước uống', N'Trà sữa, nước ngọt, nước trái cây')
INSERT [dbo].[Category] ([category_id], [name], [description]) VALUES (7, N'Ăn vặt', N'Những món ăn vặt như xiên que, bánh mì nướng,...')
SET IDENTITY_INSERT [dbo].[Category] OFF
GO
SET IDENTITY_INSERT [dbo].[DeliveryLog] ON 

INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (1, 1, N'preparing', CAST(N'2025-07-11T13:41:58.833' AS DateTime), N'Bắt đầu chuẩn bị')
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (2, 1, N'assigned', CAST(N'2025-07-11T13:41:58.833' AS DateTime), N'Đã giao cho shipper')
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (3, 2, N'delivering', CAST(N'2025-07-11T13:41:58.833' AS DateTime), N'Đang giao')
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (4, 3, N'preparing', CAST(N'2025-07-13T13:21:50.000' AS DateTime), N'Bắt đầu chuẩn bị đơn hàng')
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (5, 4, N'preparing', CAST(N'2025-07-13T13:46:43.000' AS DateTime), N'Bắt đầu chuẩn bị đơn hàng')
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (6, 5, N'preparing', CAST(N'2025-07-13T13:47:58.000' AS DateTime), N'Bắt đầu chuẩn bị đơn hàng')
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (7, 6, N'preparing', CAST(N'2025-07-13T13:54:39.000' AS DateTime), N'Bắt đầu chuẩn bị đơn hàng')
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (8, 7, N'preparing', CAST(N'2025-07-14T16:53:27.000' AS DateTime), N'Bắt đầu chuẩn bị đơn hàng')
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (12, 1, N'delivering', CAST(N'2025-07-15T09:57:09.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (13, 9, N'assigned', CAST(N'2025-07-15T11:02:57.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (14, 12, N'assigned', CAST(N'2025-07-15T11:31:03.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (15, 12, N'delivering', CAST(N'2025-07-15T11:43:34.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (16, 12, N'success', CAST(N'2025-07-15T11:47:17.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (17, 13, N'assigned', CAST(N'2025-07-15T11:48:25.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (18, 13, N'delivering', CAST(N'2025-07-15T11:48:41.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (19, 13, N'success', CAST(N'2025-07-15T12:00:05.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (20, 14, N'assigned', CAST(N'2025-07-15T12:01:52.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (21, 14, N'delivering', CAST(N'2025-07-15T12:02:00.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (22, 14, N'failed_1', CAST(N'2025-07-15T12:20:48.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (23, 14, N'redelivery', CAST(N'2025-07-15T16:12:26.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (24, 14, N'success', CAST(N'2025-07-15T16:13:09.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (25, 15, N'assigned', CAST(N'2025-07-15T16:28:56.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (26, 15, N'delivering', CAST(N'2025-07-15T16:29:24.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (27, 15, N'failed_1', CAST(N'2025-07-15T16:29:56.000' AS DateTime), N'Khách không nghe máy')
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (28, 15, N'redelivery', CAST(N'2025-07-15T16:30:51.000' AS DateTime), N'Khách hẹn giao lại chiều')
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (29, 15, N'delivering', CAST(N'2025-07-15T16:44:28.000' AS DateTime), NULL)
INSERT [dbo].[DeliveryLog] ([log_id], [order_id], [status], [timestamp], [note]) VALUES (30, 15, N'failed_2', CAST(N'2025-07-15T16:52:04.000' AS DateTime), N'Khách không từ chối lấy đơn, không nhận nữa, không bắt máy')
SET IDENTITY_INSERT [dbo].[DeliveryLog] OFF
GO
SET IDENTITY_INSERT [dbo].[Dish] ON 

INSERT [dbo].[Dish] ([dish_id], [name], [description], [price], [image_url], [category_id], [is_available]) VALUES (1, N'Cơm gà xối mỡ', N'Cơm gà giòn rụm, ăn kèm nước mắm gừng', 50000, N'https://res.cloudinary.com/dqpncgm9i/image/upload/v1752384883/fastfood/dishes/g6vk7sbqgpce5g6lvi4q.webp', 1, 1)
INSERT [dbo].[Dish] ([dish_id], [name], [description], [price], [image_url], [category_id], [is_available]) VALUES (2, N'Mì xào bò', N'Mì xào bò cay tê', 40000, N'https://res.cloudinary.com/dqpncgm9i/image/upload/v1752385014/fastfood/dishes/jgkfoyr2nb7gbg6h8ows.webp', 2, 1)
INSERT [dbo].[Dish] ([dish_id], [name], [description], [price], [image_url], [category_id], [is_available]) VALUES (3, N'Trà sữa trân châu', N'Trà sữa nhà làm', 25000, N'https://res.cloudinary.com/dqpncgm9i/image/upload/v1752385087/fastfood/dishes/ikpves6cilhoeipbawpm.png', 3, 1)
INSERT [dbo].[Dish] ([dish_id], [name], [description], [price], [image_url], [category_id], [is_available]) VALUES (4, N'Cơm Tấm Sườn Bì Thuần Chay Âu Lạc 145g', N'Thành phần: Gạo (80%), hành lá, dầu hành, bì chay (3%), sườn chay từ đạm đậu nành (5%), nước mắm chay ăn liền. Hướng dẫn sử dụng: Đổ nước sôi vào phần cơm và đợi trong ít phút là dùng. Hướng dẫn bảo quản: bảo quản nơi khô ráo, thoáng mát. Tránh nhiệt độ cao và ánh nắng trực tiếp.', 50000, N'https://res.cloudinary.com/dqpncgm9i/image/upload/v1752384339/fastfood/dishes/icrwoidb9wtrktwq3hwe.webp', 1, 1)
SET IDENTITY_INSERT [dbo].[Dish] OFF
GO
SET IDENTITY_INSERT [dbo].[FailedDelivery] ON 

INSERT [dbo].[FailedDelivery] ([fail_id], [order_id], [attempt], [reason], [logged_at]) VALUES (1, 2, 1, N'Khách không nghe máy', CAST(N'2025-07-11T13:44:39.280' AS DateTime))
SET IDENTITY_INSERT [dbo].[FailedDelivery] OFF
GO
SET IDENTITY_INSERT [dbo].[Order] ON 

INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (1, 1, N'preparing', 95000, N'COD', CAST(N'2025-07-11T13:38:54.957' AS DateTime), CAST(N'2025-07-11T13:38:54.957' AS DateTime), NULL)
INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (2, 2, N'delivering', 25000, N'VNPAY', CAST(N'2025-07-11T13:38:54.957' AS DateTime), CAST(N'2025-07-11T13:38:54.957' AS DateTime), NULL)
INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (3, 3, N'preparing', 100000, N'COD', CAST(N'2025-07-13T13:21:50.000' AS DateTime), CAST(N'2025-07-13T13:21:50.000' AS DateTime), NULL)
INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (4, 3, N'preparing', 25000, N'COD', CAST(N'2025-07-13T13:46:43.000' AS DateTime), CAST(N'2025-07-13T13:46:43.000' AS DateTime), NULL)
INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (5, 3, N'preparing', 170000, N'COD', CAST(N'2025-07-13T13:47:58.000' AS DateTime), CAST(N'2025-07-13T13:47:58.000' AS DateTime), NULL)
INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (6, 3, N'preparing', 125000, N'COD', CAST(N'2025-07-13T13:54:39.000' AS DateTime), CAST(N'2025-07-13T13:54:39.000' AS DateTime), NULL)
INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (7, 3, N'preparing', 50000, N'COD', CAST(N'2025-07-14T16:53:27.000' AS DateTime), CAST(N'2025-07-14T16:53:27.000' AS DateTime), NULL)
INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (9, 3, N'preparing', 0, N'COD', CAST(N'2025-07-14T17:57:08.000' AS DateTime), CAST(N'2025-07-14T17:57:08.000' AS DateTime), NULL)
INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (10, 3, N'assigned', 125000, N'COD', CAST(N'2025-07-14T17:58:28.000' AS DateTime), CAST(N'2025-07-14T17:58:28.000' AS DateTime), NULL)
INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (11, 3, N'preparing', 125000, N'COD', CAST(N'2025-07-15T11:21:39.000' AS DateTime), CAST(N'2025-07-15T11:21:39.000' AS DateTime), NULL)
INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (12, 3, N'success', 65000, N'COD', CAST(N'2025-07-15T11:29:43.000' AS DateTime), CAST(N'2025-07-15T11:29:43.000' AS DateTime), NULL)
INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (13, 3, N'success', 50000, N'COD', CAST(N'2025-07-15T11:40:01.953' AS DateTime), CAST(N'2025-07-15T11:40:01.953' AS DateTime), N'456, Lê Văn Việt')
INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (14, 3, N'success', 140000, N'COD', CAST(N'2025-07-15T11:43:01.190' AS DateTime), CAST(N'2025-07-15T11:43:01.190' AS DateTime), N'161/31, Lê Tấn Bê, An Lạc, Bình Tân, TP.HCM')
INSERT [dbo].[Order] ([order_id], [user_id], [status], [total_amount], [payment_method], [created_at], [updated_at], [address]) VALUES (15, 3, N'bomb', 180000, N'COD', CAST(N'2025-07-15T16:28:30.223' AS DateTime), CAST(N'2025-07-15T16:28:30.223' AS DateTime), N'123 Lê Lợi, Quận 1, TP.HCM')
SET IDENTITY_INSERT [dbo].[Order] OFF
GO
SET IDENTITY_INSERT [dbo].[OrderItem] ON 

INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (1, 1, 1, 2, 35000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (2, 1, 3, 1, 25000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (3, 2, 3, 1, 25000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (4, 3, 1, 2, 50000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (5, 4, 3, 1, 25000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (6, 5, 3, 2, 25000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (7, 5, 2, 3, 40000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (8, 6, 1, 2, 50000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (9, 6, 3, 1, 25000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (10, 7, 1, 1, 50000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (11, 12, 2, 1, 40000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (12, 12, 3, 1, 25000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (13, 13, 3, 2, 25000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (14, 14, 1, 2, 50000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (15, 14, 2, 1, 40000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (16, 15, 1, 2, 50000)
INSERT [dbo].[OrderItem] ([order_item_id], [order_id], [dish_id], [quantity], [unit_price]) VALUES (17, 15, 2, 2, 40000)
SET IDENTITY_INSERT [dbo].[OrderItem] OFF
GO
SET IDENTITY_INSERT [dbo].[Payment] ON 

INSERT [dbo].[Payment] ([payment_id], [order_id], [amount], [payment_method], [status], [paid_at]) VALUES (1, 1, 95000, N'COD', N'pending', NULL)
INSERT [dbo].[Payment] ([payment_id], [order_id], [amount], [payment_method], [status], [paid_at]) VALUES (2, 2, 25000, N'VNPAY', N'completed', CAST(N'2025-07-11T13:40:39.880' AS DateTime))
INSERT [dbo].[Payment] ([payment_id], [order_id], [amount], [payment_method], [status], [paid_at]) VALUES (3, 3, 100000, N'COD', N'pending', NULL)
INSERT [dbo].[Payment] ([payment_id], [order_id], [amount], [payment_method], [status], [paid_at]) VALUES (4, 4, 25000, N'COD', N'pending', NULL)
INSERT [dbo].[Payment] ([payment_id], [order_id], [amount], [payment_method], [status], [paid_at]) VALUES (5, 5, 170000, N'COD', N'pending', NULL)
INSERT [dbo].[Payment] ([payment_id], [order_id], [amount], [payment_method], [status], [paid_at]) VALUES (6, 6, 125000, N'COD', N'pending', NULL)
INSERT [dbo].[Payment] ([payment_id], [order_id], [amount], [payment_method], [status], [paid_at]) VALUES (7, 7, 50000, N'COD', N'pending', NULL)
SET IDENTITY_INSERT [dbo].[Payment] OFF
GO
SET IDENTITY_INSERT [dbo].[RevenueReport] ON 

INSERT [dbo].[RevenueReport] ([report_id], [date], [total_orders], [total_revenue]) VALUES (1, CAST(N'2025-07-10' AS Date), 2, 120000)
INSERT [dbo].[RevenueReport] ([report_id], [date], [total_orders], [total_revenue]) VALUES (2, CAST(N'2025-07-11' AS Date), 1, 25000)
SET IDENTITY_INSERT [dbo].[RevenueReport] OFF
GO
SET IDENTITY_INSERT [dbo].[Shipper] ON 

INSERT [dbo].[Shipper] ([shipper_id], [user_name], [full_name], [phone], [email], [password_hash], [created_at]) VALUES (1, N'shipper_acc01', N'Lê Văn Ship', N'0912345678', N'ship01@fastfood.vn', N'$2a$12$YDYcSm/k1AbBNcUp.7EjGu7O1dL.gjmntQfcJ8p1QW.K1UeXfVJYa', CAST(N'2025-07-11T13:22:39.387' AS DateTime))
INSERT [dbo].[Shipper] ([shipper_id], [user_name], [full_name], [phone], [email], [password_hash], [created_at]) VALUES (2, N'shipper_acc02', N'Mai Thị Giao', N'0911222333', N'ship02@fastfood.vn', N'$2a$12$abRTANXYZDuJNtkm5QJ5ueaQ.Py6xNPOmeNEr.5LdvfQr0FE9BoAO', CAST(N'2025-07-11T13:22:39.387' AS DateTime))
SET IDENTITY_INSERT [dbo].[Shipper] OFF
GO
SET IDENTITY_INSERT [dbo].[Shipping] ON 

INSERT [dbo].[Shipping] ([shipping_id], [order_id], [shipper_id], [current_status], [updated_at]) VALUES (1, 1, 1, N'on_way', CAST(N'2025-07-15T09:57:09.000' AS DateTime))
INSERT [dbo].[Shipping] ([shipping_id], [order_id], [shipper_id], [current_status], [updated_at]) VALUES (2, 2, 2, N'on_way', CAST(N'2025-07-11T13:40:56.670' AS DateTime))
INSERT [dbo].[Shipping] ([shipping_id], [order_id], [shipper_id], [current_status], [updated_at]) VALUES (4, 9, 1, N'pending', CAST(N'2025-07-15T11:02:57.000' AS DateTime))
INSERT [dbo].[Shipping] ([shipping_id], [order_id], [shipper_id], [current_status], [updated_at]) VALUES (5, 10, 1, N'pending', CAST(N'2025-07-15T09:40:28.000' AS DateTime))
INSERT [dbo].[Shipping] ([shipping_id], [order_id], [shipper_id], [current_status], [updated_at]) VALUES (6, 11, NULL, N'pending', CAST(N'2025-07-15T11:21:39.000' AS DateTime))
INSERT [dbo].[Shipping] ([shipping_id], [order_id], [shipper_id], [current_status], [updated_at]) VALUES (7, 12, 1, N'delivered', CAST(N'2025-07-15T11:47:17.000' AS DateTime))
INSERT [dbo].[Shipping] ([shipping_id], [order_id], [shipper_id], [current_status], [updated_at]) VALUES (8, 13, 1, N'delivered', CAST(N'2025-07-15T12:00:05.000' AS DateTime))
INSERT [dbo].[Shipping] ([shipping_id], [order_id], [shipper_id], [current_status], [updated_at]) VALUES (9, 14, 1, N'delivered', CAST(N'2025-07-15T16:13:09.000' AS DateTime))
INSERT [dbo].[Shipping] ([shipping_id], [order_id], [shipper_id], [current_status], [updated_at]) VALUES (10, 15, 1, N'failed', CAST(N'2025-07-15T16:52:04.000' AS DateTime))
SET IDENTITY_INSERT [dbo].[Shipping] OFF
GO
SET IDENTITY_INSERT [dbo].[User] ON 

INSERT [dbo].[User] ([user_id], [user_name], [email], [full_name], [phone], [password_hash], [address], [avatar_url], [gender], [birthdate], [status], [is_flagged], [boom_count], [note], [created_at]) VALUES (1, N'user1', N'user1@gmail.com', N'Nguyễn Văn A', N'0909123456', N'$2a$12$jWItFLRpify8ppjQmugKFe8A6PwK0SqUqobxJwdo4g/J7e.B1S5iW', N'123 Lê Lợi, Q1', NULL, N'male', CAST(N'2004-01-01' AS Date), N'active', 0, 0, NULL, CAST(N'2025-07-11T13:13:57.447' AS DateTime))
INSERT [dbo].[User] ([user_id], [user_name], [email], [full_name], [phone], [password_hash], [address], [avatar_url], [gender], [birthdate], [status], [is_flagged], [boom_count], [note], [created_at]) VALUES (2, N'user2', N'user2@gmail.com', N'Trần Thị B', N'0909345678', N'$2a$12$O17dwWQ5mEmeZQzzZQbKyeoQdQLlJYENT86caifgQGSZaAO52pUce', N'456 Nguyễn Huệ, Q1', NULL, N'female', CAST(N'2004-07-15' AS Date), N'active', 0, 0, NULL, CAST(N'2025-07-11T13:13:57.447' AS DateTime))
INSERT [dbo].[User] ([user_id], [user_name], [email], [full_name], [phone], [password_hash], [address], [avatar_url], [gender], [birthdate], [status], [is_flagged], [boom_count], [note], [created_at]) VALUES (3, N'jonnytran', N'jonnytran.working@gmail.com', N'Jonny Tran', N'0869503259', N'$2b$10$j3XWnwi2zfBudJJ6aHDMF.tXUu9SsRyp1riuMnBii20Dd4X5n7Hke', N'161/31, Lê Tấn Bê, An Lạc, Bình Tân, TP.HCM', N'https://res.cloudinary.com/dqpncgm9i/image/upload/v1752769090/fastfood/profiles/gohr6sjtgkysbyiy3cro.jpg', N'male', CAST(N'2003-11-04' AS Date), N'active', 0, 1, NULL, CAST(N'2025-07-12T15:01:53.900' AS DateTime))
INSERT [dbo].[User] ([user_id], [user_name], [email], [full_name], [phone], [password_hash], [address], [avatar_url], [gender], [birthdate], [status], [is_flagged], [boom_count], [note], [created_at]) VALUES (4, N'testuser_1752314911927', N'testuser_1752314911927@example.com', N'Test User', N'0909702610', N'$2b$10$kPXQyd1IXhlTBoaBzihJs.CgN6AeVvmqElW1krFWreA8ji5lqIPIe', NULL, NULL, NULL, NULL, N'active', 0, 0, NULL, CAST(N'2025-07-12T17:08:33.370' AS DateTime))
INSERT [dbo].[User] ([user_id], [user_name], [email], [full_name], [phone], [password_hash], [address], [avatar_url], [gender], [birthdate], [status], [is_flagged], [boom_count], [note], [created_at]) VALUES (5, N'testuser_1752315305521', N'testuser_1752315305521@example.com', N'Test User', N'0909657439', N'$2b$10$qElZH.w1HewyQ659Fmw5Zu8bLrM8EoinI8JmZAlg5IpDYSoyC8i7G', NULL, NULL, NULL, NULL, N'active', 0, 0, NULL, CAST(N'2025-07-12T17:15:07.310' AS DateTime))
INSERT [dbo].[User] ([user_id], [user_name], [email], [full_name], [phone], [password_hash], [address], [avatar_url], [gender], [birthdate], [status], [is_flagged], [boom_count], [note], [created_at]) VALUES (6, N'testuser_1752315851228', N'testuser_1752315851228@example.com', N'Test User', N'0909247248', N'$2b$10$nIiJ0wxtC6HaMksyYXufDOt0M/PVsSXsOA5Lwzwbi5qKGpUkDWhEy', NULL, NULL, NULL, NULL, N'active', 0, 0, NULL, CAST(N'2025-07-12T17:24:11.833' AS DateTime))
INSERT [dbo].[User] ([user_id], [user_name], [email], [full_name], [phone], [password_hash], [address], [avatar_url], [gender], [birthdate], [status], [is_flagged], [boom_count], [note], [created_at]) VALUES (7, N'testuser_1752316106567', N'testuser_1752316106567@example.com', N'Test User', N'0909607355', N'$2b$10$3.b2yKunKuLXBSdwcBM8CeU43KQzEQzcN12bZGIB.KzPyarsQ8d8.', NULL, NULL, NULL, NULL, N'active', 0, 0, NULL, CAST(N'2025-07-12T17:28:28.020' AS DateTime))
INSERT [dbo].[User] ([user_id], [user_name], [email], [full_name], [phone], [password_hash], [address], [avatar_url], [gender], [birthdate], [status], [is_flagged], [boom_count], [note], [created_at]) VALUES (8, N'testuser_1752316220243', N'testuser_1752316220243@example.com', N'Test User', N'0909550982', N'$2b$10$lyPLBxhBesH5jeYXXF.s9esmYLcbfj8I06cozLXai0mCJPDbIrES6', NULL, NULL, NULL, NULL, N'active', 0, 0, NULL, CAST(N'2025-07-12T17:30:21.383' AS DateTime))
INSERT [dbo].[User] ([user_id], [user_name], [email], [full_name], [phone], [password_hash], [address], [avatar_url], [gender], [birthdate], [status], [is_flagged], [boom_count], [note], [created_at]) VALUES (9, N'testuser_1752325004100', N'testuser_1752325004100@example.com', N'Test User', N'0909301539', N'$2b$10$gyoSeffQSr5DiN14DcRpJuYOBW8WLheHwwd4e9pW1gaCZXDOmB.D6', NULL, NULL, NULL, NULL, N'active', 0, 0, NULL, CAST(N'2025-07-12T19:56:45.110' AS DateTime))
INSERT [dbo].[User] ([user_id], [user_name], [email], [full_name], [phone], [password_hash], [address], [avatar_url], [gender], [birthdate], [status], [is_flagged], [boom_count], [note], [created_at]) VALUES (10, N'testuser_1752325070997', N'testuser_1752325070997@example.com', N'Test User', N'0909242504', N'$2b$10$QsZMDN63qMhl9/3G1h63kOd7FqqrEfBP6QtYvbJumGiOIK1aiwEri', NULL, NULL, NULL, NULL, N'active', 0, 0, NULL, CAST(N'2025-07-12T19:57:51.407' AS DateTime))
SET IDENTITY_INSERT [dbo].[User] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Admin__AB6E6164DF1D014A]    Script Date: 18/07/2025 12:00:38 SA ******/
ALTER TABLE [dbo].[Admin] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Category__72E12F1B68F666CD]    Script Date: 18/07/2025 12:00:38 SA ******/
ALTER TABLE [dbo].[Category] ADD UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Shipper__AB6E616404797205]    Script Date: 18/07/2025 12:00:38 SA ******/
ALTER TABLE [dbo].[Shipper] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Shipper__B43B145FC55337E1]    Script Date: 18/07/2025 12:00:38 SA ******/
ALTER TABLE [dbo].[Shipper] ADD UNIQUE NONCLUSTERED 
(
	[phone] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__User__AB6E6164069B3EB1]    Script Date: 18/07/2025 12:00:38 SA ******/
ALTER TABLE [dbo].[User] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__User__B43B145F95039294]    Script Date: 18/07/2025 12:00:38 SA ******/
ALTER TABLE [dbo].[User] ADD UNIQUE NONCLUSTERED 
(
	[phone] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Dish] ADD  DEFAULT ((1)) FOR [is_available]
GO
ALTER TABLE [dbo].[Order] ADD  DEFAULT ('COD') FOR [payment_method]
GO
ALTER TABLE [dbo].[Order] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[Order] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[Shipper] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[User] ADD  DEFAULT ('active') FOR [status]
GO
ALTER TABLE [dbo].[User] ADD  DEFAULT ((0)) FOR [boom_count]
GO
ALTER TABLE [dbo].[User] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[DeliveryLog]  WITH CHECK ADD  CONSTRAINT [FK_DeliveryLog_Order] FOREIGN KEY([order_id])
REFERENCES [dbo].[Order] ([order_id])
GO
ALTER TABLE [dbo].[DeliveryLog] CHECK CONSTRAINT [FK_DeliveryLog_Order]
GO
ALTER TABLE [dbo].[Dish]  WITH CHECK ADD  CONSTRAINT [FK_Dish_Category] FOREIGN KEY([category_id])
REFERENCES [dbo].[Category] ([category_id])
GO
ALTER TABLE [dbo].[Dish] CHECK CONSTRAINT [FK_Dish_Category]
GO
ALTER TABLE [dbo].[FailedDelivery]  WITH CHECK ADD  CONSTRAINT [FK_FailedDelivery_Order] FOREIGN KEY([order_id])
REFERENCES [dbo].[Order] ([order_id])
GO
ALTER TABLE [dbo].[FailedDelivery] CHECK CONSTRAINT [FK_FailedDelivery_Order]
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD  CONSTRAINT [FK_Order_User] FOREIGN KEY([user_id])
REFERENCES [dbo].[User] ([user_id])
GO
ALTER TABLE [dbo].[Order] CHECK CONSTRAINT [FK_Order_User]
GO
ALTER TABLE [dbo].[OrderItem]  WITH CHECK ADD  CONSTRAINT [FK_OrderItem_Dish] FOREIGN KEY([dish_id])
REFERENCES [dbo].[Dish] ([dish_id])
GO
ALTER TABLE [dbo].[OrderItem] CHECK CONSTRAINT [FK_OrderItem_Dish]
GO
ALTER TABLE [dbo].[OrderItem]  WITH CHECK ADD  CONSTRAINT [FK_OrderItem_Order] FOREIGN KEY([order_id])
REFERENCES [dbo].[Order] ([order_id])
GO
ALTER TABLE [dbo].[OrderItem] CHECK CONSTRAINT [FK_OrderItem_Order]
GO
ALTER TABLE [dbo].[Payment]  WITH CHECK ADD  CONSTRAINT [FK_Payment_Order] FOREIGN KEY([order_id])
REFERENCES [dbo].[Order] ([order_id])
GO
ALTER TABLE [dbo].[Payment] CHECK CONSTRAINT [FK_Payment_Order]
GO
ALTER TABLE [dbo].[Shipping]  WITH CHECK ADD  CONSTRAINT [FK_Shipping_Order] FOREIGN KEY([order_id])
REFERENCES [dbo].[Order] ([order_id])
GO
ALTER TABLE [dbo].[Shipping] CHECK CONSTRAINT [FK_Shipping_Order]
GO
ALTER TABLE [dbo].[Shipping]  WITH CHECK ADD  CONSTRAINT [FK_Shipping_Shipper] FOREIGN KEY([shipper_id])
REFERENCES [dbo].[Shipper] ([shipper_id])
GO
ALTER TABLE [dbo].[Shipping] CHECK CONSTRAINT [FK_Shipping_Shipper]
GO
ALTER TABLE [dbo].[DeliveryLog]  WITH CHECK ADD CHECK  (([status]='bomb' OR [status]='failed_2' OR [status]='redelivery' OR [status]='failed_1' OR [status]='success' OR [status]='delivering' OR [status]='assigned' OR [status]='preparing'))
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD CHECK  (([status]='bomb' OR [status]='failed_2' OR [status]='redelivery' OR [status]='failed_1' OR [status]='success' OR [status]='delivering' OR [status]='assigned' OR [status]='preparing'))
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD  CONSTRAINT [CK_Order_PaymentMethod] CHECK  (([payment_method]='MOMO' OR [payment_method]='VNPAY' OR [payment_method]='COD'))
GO
ALTER TABLE [dbo].[Order] CHECK CONSTRAINT [CK_Order_PaymentMethod]
GO
ALTER TABLE [dbo].[Payment]  WITH CHECK ADD CHECK  (([status]='failed' OR [status]='completed' OR [status]='pending'))
GO
ALTER TABLE [dbo].[Payment]  WITH CHECK ADD  CONSTRAINT [CK_Payment_PaymentMethod] CHECK  (([payment_method]='MOMO' OR [payment_method]='VNPAY' OR [payment_method]='COD'))
GO
ALTER TABLE [dbo].[Payment] CHECK CONSTRAINT [CK_Payment_PaymentMethod]
GO
ALTER TABLE [dbo].[Shipping]  WITH CHECK ADD  CONSTRAINT [CK_Shipping_CurrentStatus] CHECK  (([current_status]='bomb' OR [current_status]='returned' OR [current_status]='failed' OR [current_status]='delivered' OR [current_status]='on_way' OR [current_status]='picked_up' OR [current_status]='pending'))
GO
ALTER TABLE [dbo].[Shipping] CHECK CONSTRAINT [CK_Shipping_CurrentStatus]
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD CHECK  (([gender]='other' OR [gender]='female' OR [gender]='male'))
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD CHECK  (([status]='banned' OR [status]='inactive' OR [status]='active'))
GO
USE [master]
GO
ALTER DATABASE [Fast_Food_db] SET  READ_WRITE 
GO
