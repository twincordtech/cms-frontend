/* ========================================================================
 * File: DashboardHome.jsx
 * Description: CMS Home Dashboard with stats, charts, newsletters, and leads table.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaEnvelope, FaChartLine, FaCalendarAlt, FaArrowUp, FaArrowDown, FaEye, FaPhone, FaEnvelopeOpen, FaSun, FaMoon, FaCloud, FaBell, FaCog, FaClock, FaArrowRight, FaFileAlt, FaPencilAlt, FaCheck, FaTrash, FaTimes } from 'react-icons/fa';
import { cmsApi, newsletterApi, getAllLeads } from '../../services/api';
import Card from '../../components/elements/Card';
import Button from '../../components/elements/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { StatCardSkeleton, ChartSkeleton, NewsletterSkeleton, LeadTableSkeleton } from '../../components/skeletons/DashboardSkeletons';
import { format, formatDistanceToNow, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import CountUp from 'react-countup';
import NotificationCenter from '../../components/global/NotificationCenter';

/**
 * DashboardHome Component
 * Main dashboard home page showing stats, charts, newsletters, and recent leads.
 * Fetches data from API and handles loading/error states.
 * @component
 */
const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('daily');
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalNewsletters: 0,
    totalSubscribers: 0,
    totalBlogs: 0,
    recentLeads: [],
    upcomingNewsletters: [],
    growthStats: {
      leads: 0,
      newsletters: 0,
      subscribers: 0,
      blogs: 0
    },
    chartData: {
      daily: [],
      monthly: []
    },
    recentBlogs: []
  });
  const [theme, setTheme] = useState('light');

  /**
   * Returns time-based greeting and icon for the dashboard header.
   * @returns {{text: string, icon: string, color: string}}
   */
  const getTimeBasedInfo = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return {
        text: 'Good Morning',
        icon: '☀️',
        color: 'bg-blue-600'
      };
    }
    if (hour >= 12 && hour < 17) {
      return {
        text: 'Good Afternoon',
        icon: '☀️',
        color: 'bg-blue-600'
      };
    }
    if (hour >= 17 && hour < 21) {
      return {
        text: 'Good Evening',
        icon: '🌥️',
        color: 'bg-blue-900'
      };
    }
    return {
      text: 'Good Night',
      icon: '🌙',
      color: 'bg-blue-900'
    };
  };

  /**
   * Calculates growth percentage between current and previous values.
   * @param {number} current
   * @param {number} previous
   * @returns {number}
   */
  const calculateGrowthPercentage = (current, previous) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  /**
   * Generates chart data for daily and monthly leads.
   * @param {Array} leads
   * @returns {{daily: Array, monthly: Array}}
   */
  const generateChartData = (leads) => {
    const dailyData = {};
    const monthlyData = {};

    // Process leads data
    leads.forEach(lead => {
      const date = new Date(lead.createdAt);
      const dayKey = format(date, 'MMM d');
      const monthKey = format(date, 'MMM yyyy');

      dailyData[dayKey] = (dailyData[dayKey] || 0) + 1;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    // Convert to array format and fill missing days
    const daily = [];
    const monthly = [];

    // Fill daily data for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const key = format(date, 'MMM d');
      daily.push({
        date: key,
        count: dailyData[key] || 0
      });
    }

    // Fill monthly data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = format(date, 'MMM yyyy');
      monthly.push({
        date: key,
        count: monthlyData[key] || 0
      });
    }

    return { daily, monthly };
  };

  /**
   * Fetches dashboard stats, newsletters, leads, and blogs from API.
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current data
      const [currentLeadsRes, newslettersRes, subscribersRes, blogsRes] = await Promise.all([
        getAllLeads(),
        newsletterApi.getNewsletters(),
        newsletterApi.getSubscribers(),
        cmsApi.getBlogs()
      ]);

      // Current counts - Fix data access patterns
      const currentLeads = currentLeadsRes?.data || [];
      const newsletters = newslettersRes?.data?.data || [];
      const subscribers = subscribersRes?.data?.data || [];
      const blogs = blogsRes?.data?.data || [];

      // Log all fetched data individually
      console.log('DashboardHome: Current Leads:', currentLeads);
      console.log('DashboardHome: Newsletters:', newsletters);
      console.log('DashboardHome: Subscribers:', subscribers);
      console.log('DashboardHome: Blogs:', blogs);

      // Previous counts - Fix data access patterns
      // const previousLeads = previousLeadsRes?.data?.data || [];
      // const previousBlogs = previousBlogsRes?.data?.data || [];
      // For now, set previousLeads and previousBlogs to 0 (or [] if you want to compare arrays)
      const previousLeads = [];
      const previousBlogs = [];

      // Generate chart data
      const chartData = generateChartData(currentLeads);
      console.log('DashboardHome: Chart Data:', chartData);

      // Calculate growth percentages
      const growthStats = {
        leads: calculateGrowthPercentage(currentLeads.length, previousLeads.length),
        newsletters: calculateGrowthPercentage(newsletters.length, newsletters.length - newsletters.filter(n => new Date(n.createdAt) > subDays(new Date(), 30)).length),
        subscribers: calculateGrowthPercentage(subscribers.length, subscribers.length - Math.floor(subscribers.length * 0.8)),
        blogs: calculateGrowthPercentage(blogs.length, previousBlogs.length)
      };
      console.log('DashboardHome: Growth Stats:', growthStats);

      // Process newsletters
      const upcomingNewsletters = newsletters
        .filter(n => {
          // Check if newsletter has a schedule and nextSendDate is in the future
          if (n.schedule && n.schedule.nextSendDate) {
            return new Date(n.schedule.nextSendDate) > new Date();
          }
          return false;
        })
        .sort((a, b) => new Date(a.schedule.nextSendDate) - new Date(b.schedule.nextSendDate))
        .slice(0, 3);

      // If no scheduled newsletters, show latest newsletters
      const displayNewsletters = upcomingNewsletters.length > 0 
        ? upcomingNewsletters 
        : newsletters
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
      console.log('DashboardHome: Display Newsletters:', displayNewsletters);
      
      // Log recent leads and blogs
      console.log('DashboardHome: Recent Leads:', currentLeads.slice(0, 5));
      console.log('DashboardHome: Recent Blogs:', blogs.slice(0, 5));
      
      setStats({
        totalLeads: currentLeads.length,
        totalNewsletters: newsletters.length,
        totalSubscribers: subscribers.length,
        totalBlogs: blogs.length,
        recentLeads: currentLeads.slice(0, 5),
        upcomingNewsletters: displayNewsletters,
        growthStats,
        chartData,
        recentBlogs: blogs.slice(0, 5)
      });
    } catch (error) {
      // Set default values in case of error
      setStats(prev => ({
        ...prev,
        chartData: {
          daily: Array(7).fill(0).map((_, i) => ({
            date: format(subDays(new Date(), i), 'MMM d'),
            count: 0
          })),
          monthly: Array(6).fill(0).map((_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return {
              date: format(date, 'MMM yyyy'),
              count: 0
            };
          })
        },
        recentBlogs: []
      }));
    } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDashboardData();
    const timeInfo = getTimeBasedInfo();
    setTheme(timeInfo.theme);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6" aria-label="Loading Dashboard Home">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <StatCardSkeleton key={item} />
          ))}
        </div>

        {/* Charts and Newsletter Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
          <NewsletterSkeleton />
        </div>

        {/* Leads Table Skeleton */}
        <LeadTableSkeleton />
      </div>
    );
  }

  const timeInfo = getTimeBasedInfo();

  return (
    <div className="container max-w-full mx-auto px-4 py-6" aria-label="Dashboard Home Page">
      {/* Header */}
      <div className="bg-[#1e2875] rounded-xl shadow-lg overflow-hidden mb-6">
        <div className="px-6 py-4">
      <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-8">
              {/* Profile and Welcome */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    S
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#1e2875] rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-gray-300 mb-1">
                    <span className="text-lg">{timeInfo.icon}</span>
                    <span className="text-sm">{timeInfo.text}</span>
                  </div>
                  <h1 className="text-white text-lg font-semibold">
                    Welcome back, <span className="text-blue-400">Srikanth</span>
                  </h1>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-6 border-l border-gray-700 pl-6">
                <div className="text-gray-300">
                  <span className="block text-sm">New Leads</span>
                  <span className="text-xl font-bold text-white">
                    <CountUp end={stats.totalLeads} duration={2} />
                  </span>
                </div>
                <div className="text-gray-300">
                  <span className="block text-sm">Newsletters</span>
                  <span className="text-xl font-bold text-white">
                    <CountUp end={stats.upcomingNewsletters.length} duration={2} />
                  </span>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <button className="p-2 rounded-lg hover:bg-blue-800/50 transition-colors">
                <FaCog className="w-5 h-5 text-gray-300" />
              </button>
              <button
                onClick={fetchDashboardData}
                className="p-2 rounded-lg hover:bg-blue-800/50 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-300 hover:rotate-180 transition-transform duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#4318FF] rounded-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium mb-2">Total Leads</h3>
              <div className="text-4xl font-bold mb-2">
                <CountUp end={stats.totalLeads} duration={2} />
              </div>
              {stats.growthStats.leads !== 0 && (
                <div className="flex items-center text-sm">
                  {stats.growthStats.leads > 0 ? (
                    <FaArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <FaArrowDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{Math.abs(stats.growthStats.leads)}% {stats.growthStats.leads > 0 ? 'increase' : 'decrease'}</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <FaUsers className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-[#a855f7] rounded-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium mb-2">Newsletters</h3>
              <div className="text-4xl font-bold mb-2">
                <CountUp end={stats.totalNewsletters} duration={2} />
              </div>
              {stats.growthStats.newsletters !== 0 && (
                <div className="flex items-center text-sm">
                  {stats.growthStats.newsletters > 0 ? (
                    <FaArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <FaArrowDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{Math.abs(stats.growthStats.newsletters)}% {stats.growthStats.newsletters > 0 ? 'increase' : 'decrease'}</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <FaEnvelope className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-[#16a34a] rounded-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium mb-2">Subscribers</h3>
              <div className="text-4xl font-bold mb-2">
                <CountUp end={stats.totalSubscribers} duration={2} />
              </div>
              {stats.growthStats.subscribers !== 0 && (
                <div className="flex items-center text-sm">
                  {stats.growthStats.subscribers > 0 ? (
                    <FaArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <FaArrowDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{Math.abs(stats.growthStats.subscribers)}% {stats.growthStats.subscribers > 0 ? 'increase' : 'decrease'}</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <FaChartLine className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-[#f97316] rounded-xl p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium mb-2">Blog Posts</h3>
              <div className="text-4xl font-bold mb-2">
                <CountUp end={stats.totalBlogs} duration={2} />
              </div>
              {stats.growthStats.blogs !== 0 && (
                <div className="flex items-center text-sm">
                  {stats.growthStats.blogs > 0 ? (
                    <FaArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <FaArrowDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{Math.abs(stats.growthStats.blogs)}% {stats.growthStats.blogs > 0 ? 'increase' : 'decrease'}</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <FaCalendarAlt className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Upcoming Newsletters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Lead Growth Chart */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Lead Growth</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveChart('daily')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeChart === 'daily'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setActiveChart('monthly')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeChart === 'monthly'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.chartData[activeChart]}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      padding: '8px 12px'
                    }}
                    labelStyle={{ color: '#1e293b', fontWeight: 500 }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorCount)"
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
        </div>
                </div>
        </Card>

        {/* Upcoming Newsletters */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {stats.upcomingNewsletters.some(n => n.schedule?.nextSendDate) 
                ? 'Upcoming Newsletters' 
                : 'Latest Newsletters'}
            </h3>
            {stats.upcomingNewsletters.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingNewsletters.map((newsletter) => (
                  <div
                    key={newsletter._id}
                    className="p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-grow">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-gray-800 line-clamp-1">{newsletter.subject}</h4>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            newsletter.status === 'scheduled' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : newsletter.status === 'sent'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-gray-50 text-gray-700 border border-gray-200'
                          }`}>
                            {newsletter.status?.charAt(0).toUpperCase() + newsletter.status?.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {newsletter.schedule?.nextSendDate && (
                            <div className="flex items-center text-gray-500 text-sm">
                              <FaCalendarAlt className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                              {format(new Date(newsletter.schedule.nextSendDate), 'MMM d, yyyy')}
                            </div>
                          )}
                          {newsletter.schedule?.scheduleTime && (
                            <div className="flex items-center text-gray-500 text-sm">
                              <FaClock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                              {newsletter.schedule.scheduleTime}
                            </div>
                          )}
                          {!newsletter.schedule?.nextSendDate && (
                            <div className="flex items-center text-gray-500 text-sm">
                              <FaClock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                              {formatDistanceToNow(new Date(newsletter.createdAt), { addSuffix: true })}
                            </div>
                          )}
                        </div>
                      </div>
                  <Link 
                        to={`/dashboard/newsletter`}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-150 group"
                  >
                        View
                        <FaArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-150" />
                  </Link>
                </div>
                  </div>
                ))}
              </div>
          ) : (
            <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <FaCalendarAlt className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No newsletters available</p>
                <p className="text-gray-400 text-sm mt-1">Create one to get started</p>
            </div>
          )}
        </div>
        </Card>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50/50">
              <th className="px-6 py-4 font-medium text-sm text-gray-500">LEAD DETAILS</th>
              <th className="px-6 py-4 font-medium text-sm text-gray-500">CONTACT</th>
              <th className="px-6 py-4 font-medium text-sm text-gray-500">STATUS</th>
              <th className="px-6 py-4 font-medium text-sm text-gray-500">SOURCE</th>
              <th className="px-6 py-4 font-medium text-sm text-gray-500">CREATED</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stats.recentLeads?.map((lead) => (
              <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors duration-150">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-medium">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">{lead.name}</span>
                      <span className="text-sm text-gray-500">{lead.company}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-gray-900">{lead.email}</span>
                    <span className="text-sm text-gray-500">{lead.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                    lead.status === 'qualified'
                      ? 'bg-emerald-50 text-emerald-700'
                      : lead.status === 'contacted'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      lead.status === 'qualified'
                        ? 'bg-emerald-600'
                        : lead.status === 'contacted'
                        ? 'bg-blue-600'
                        : 'bg-amber-600'
                    }`}></span>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                    {lead.source}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium">
                      {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(lead.createdAt), 'h:mm a')}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardHome;

/* ========================================================================
 * End of File: DashboardHome.jsx
 * ======================================================================== */ 