import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Briefcase,
  Users,
  FileText,
  MapPin,
  BarChart3,
  Clock,
  Shield,
  Smartphone,
  ArrowRight,
  Building2,
  HardHat,
  ClipboardCheck
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Briefcase,
      title: 'Project Management',
      description: 'Track budgets, timelines, and progress across all your construction projects in one centralized dashboard.'
    },
    {
      icon: FileText,
      title: 'Custom Form Builder',
      description: 'Create inspection checklists, safety forms, and daily reports with our drag-and-drop form builder.'
    },
    {
      icon: MapPin,
      title: 'Real-Time Dispatch',
      description: 'Assign workers to job sites, track locations, and manage schedules with GPS-enabled dispatching.'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Manage your field workers, subcontractors, and office staff with role-based access controls.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Generate insights with automated reports on project performance, costs, and team productivity.'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Access everything from the field. Works offline and syncs when connected.'
    }
  ];

  const painPoints = [
    {
      problem: 'Scattered Information',
      solution: 'All project data in one place - no more spreadsheets, emails, and paper forms.'
    },
    {
      problem: 'Communication Gaps',
      solution: 'Real-time updates between field and office. Everyone stays informed.'
    },
    {
      problem: 'Manual Paperwork',
      solution: 'Digital forms with photo capture, GPS tagging, and e-signatures.'
    },
    {
      problem: 'Budget Overruns',
      solution: 'Track costs in real-time. Get alerts before problems become expensive.'
    }
  ];

  const stats = [
    { value: '40%', label: 'Less time on paperwork' },
    { value: '25%', label: 'Faster project completion' },
    { value: '99.9%', label: 'Uptime reliability' },
    { value: '24/7', label: 'Support available' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">ConstructPM</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/app"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/app"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                <HardHat className="h-4 w-4" />
                Built for Construction Professionals
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Manage Projects,
                <span className="text-primary-600"> Not Paperwork</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                ConstructPM is the all-in-one platform that helps construction project managers
                track projects, dispatch workers, and digitize field operations — all from one dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/app"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  See Features
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  14-day free trial
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200">
                <div className="bg-gray-100 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Dashboard Overview</span>
                        <span className="text-xs text-gray-500">Live Data</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded p-3">
                          <div className="text-2xl font-bold text-blue-600">24</div>
                          <div className="text-xs text-gray-600">Active Projects</div>
                        </div>
                        <div className="bg-green-50 rounded p-3">
                          <div className="text-2xl font-bold text-green-600">$2.4M</div>
                          <div className="text-xs text-gray-600">Total Budget</div>
                        </div>
                        <div className="bg-purple-50 rounded p-3">
                          <div className="text-2xl font-bold text-purple-600">48</div>
                          <div className="text-xs text-gray-600">Field Workers</div>
                        </div>
                        <div className="bg-orange-50 rounded p-3">
                          <div className="text-2xl font-bold text-orange-600">94%</div>
                          <div className="text-xs text-gray-600">Completion Rate</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm">
                        <ClipboardCheck className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">Daily Safety Inspection</span>
                        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-900">Form Submitted</div>
                    <div className="text-xs text-gray-500">Just now</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-900">Worker On-Site</div>
                    <div className="text-xs text-gray-500">GPS Verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-primary-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              We Solve Your Biggest Challenges
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Construction project management shouldn't mean drowning in paperwork and chasing updates.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {painPoints.map((item, index) => (
              <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">✕</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-900 mb-1">{item.problem}</div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item.solution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From the office to the job site, ConstructPM keeps your entire team connected and productive.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Built by Construction Professionals, for Construction Professionals
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We understand the unique challenges of managing construction projects because we've lived them.
                ConstructPM is designed around how you actually work — not how software companies think you should.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Works Offline</div>
                    <div className="text-sm text-gray-600">No internet on the job site? No problem. Sync when you're back online.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Enterprise Security</div>
                    <div className="text-sm text-gray-600">Bank-level encryption. SOC 2 compliant. Your data is always protected.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Quick Setup</div>
                    <div className="text-sm text-gray-600">Get up and running in minutes, not months. Import your existing data easily.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">94%</div>
                <div className="text-primary-200 mb-6">of users report improved project visibility</div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p className="italic text-primary-100">
                    "ConstructPM transformed how we manage our projects. We cut paperwork time in half
                    and our field teams finally have the tools they need."
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="font-bold">JM</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">John Martinez</div>
                      <div className="text-sm text-primary-200">Project Manager, BuildCorp</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you're ready. No hidden fees, no long-term contracts.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="text-lg font-semibold text-gray-900 mb-2">Starter</div>
              <div className="text-gray-600 text-sm mb-4">For small teams getting started</div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$49</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Up to 5 projects
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  10 team members
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Basic form builder
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Email support
                </li>
              </ul>
              <Link
                to="/app"
                className="block w-full text-center px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="bg-primary-600 rounded-2xl p-8 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-400 text-white text-sm font-medium rounded-full">
                Most Popular
              </div>
              <div className="text-lg font-semibold text-white mb-2">Professional</div>
              <div className="text-primary-200 text-sm mb-4">For growing construction companies</div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$149</span>
                <span className="text-primary-200">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-white">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Unlimited projects
                </li>
                <li className="flex items-center gap-2 text-sm text-white">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  50 team members
                </li>
                <li className="flex items-center gap-2 text-sm text-white">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Advanced form builder
                </li>
                <li className="flex items-center gap-2 text-sm text-white">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Real-time dispatch
                </li>
                <li className="flex items-center gap-2 text-sm text-white">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Priority support
                </li>
              </ul>
              <Link
                to="/app"
                className="block w-full text-center px-4 py-2 bg-white rounded-lg font-medium text-primary-600 hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="text-lg font-semibold text-gray-900 mb-2">Enterprise</div>
              <div className="text-gray-600 text-sm mb-4">For large organizations</div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Everything in Professional
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Unlimited team members
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Custom integrations
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Dedicated account manager
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  SLA guarantee
                </li>
              </ul>
              <a
                href="mailto:sales@constructpm.com"
                className="block w-full text-center px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Construction Management?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of construction professionals who've already made the switch.
            Start your free trial today — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/app"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-lg"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="mailto:demo@constructpm.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white rounded-lg font-semibold border border-gray-600 hover:bg-gray-800 transition-colors text-lg"
            >
              Request a Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-8 w-8 text-primary-500" />
                <span className="text-xl font-bold text-white">ConstructPM</span>
              </div>
              <p className="text-gray-400 text-sm">
                The all-in-one construction project management platform built for modern teams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} ConstructPM. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
