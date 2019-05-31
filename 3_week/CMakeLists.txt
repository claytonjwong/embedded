#
# FIXME:
#
# /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/../lib/gcc/arm-none-eabi/8.2.1/../../../../arm-none-eabi/bin/ld:
# warning: cannot find entry symbol arch_paths_first; defaulting to 000000000000800c
#
# for some reason, -search_paths_first
#
cmake_minimum_required(VERSION 3.13)
project(3_week)
set(CMAKE_C_STANDARD 99)

include_directories(${PROJECT_SOURCE_DIR}/include)

set(TARGET memory)
set(CMAKE_C_COMPILER /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc)
set(LINKER_FILE ${PROJECT_SOURCE_DIR}/src/msp432p401r.lds)

set(CMAKE_C_FLAGS "-v -march=armv7e-m -mcpu=cortex-m4 -Wall -Werror -O0 -std=c99 --specs=nosys.specs -T ${LINKER_FILE}")
file(GLOB SOURCE_FILES "${PROJECT_SOURCE_DIR}/src/*.c")

add_executable(${TARGET} ${SOURCE_FILES})
set_target_properties(${TARGET} PROPERTIES LINK_DEPENDS ${LINKER_FILE})
