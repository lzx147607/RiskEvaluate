import numpy as np

# 目标函数：计算粒子适应度（值越小越好）
def sphere_function(x):
    return x[0]**2 + x[1]**2

# PSO参数
n_particles = 20
n_dim = 2
max_iter = 50
w = 0.7    # 惯性权重
c1, c2 = 1.5, 1.5  # 学习因子

# 初始化粒子群
particles_pos = np.random.uniform(-5, 5, (n_particles, n_dim))  # 初始位置在[-5,5]随机
particles_vel = np.random.uniform(-1, 1, (n_particles, n_dim))  # 初始速度
pbest_pos = particles_pos.copy()  # 个体最优位置
pbest_val = np.array([sphere_function(x) for x in particles_pos])  # 个体最优值
gbest_pos = pbest_pos[np.argmin(pbest_val)]  # 全局最优位置
gbest_val = np.min(pbest_val)  # 全局最优值

# PSO迭代
for iter in range(max_iter):
    for i in range(n_particles):
        # 更新速度
        r1, r2 = np.random.rand(), np.random.rand()
        particles_vel[i] = w * particles_vel[i] + \
                           c1 * r1 * (pbest_pos[i] - particles_pos[i]) + \
                           c2 * r2 * (gbest_pos - particles_pos[i])
        # 更新位置
        particles_pos[i] += particles_vel[i]
        # 更新个体最优和全局最优
        current_val = sphere_function(particles_pos[i])
        if current_val < pbest_val[i]:
            pbest_val[i] = current_val
            pbest_pos[i] = particles_pos[i].copy()
        if current_val < gbest_val:
            gbest_val = current_val
            gbest_pos = particles_pos[i].copy()
    print(f"Iter {iter+1}: 最优解 = {gbest_pos}, 最优值 = {gbest_val:.4f}")