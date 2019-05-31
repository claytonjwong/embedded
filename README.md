# Introduction to Embedded Systems Software and Development Environments
![University of Colorado Boulder](docs/UCBoulder.png)

---
## Lectures
* [**Week 1: Embedded System Development Components**](1_week)
  * [Introduction to Embedded Systems](1_week#introduction-to-embedded-systems)
  * [Embedded Software Engineering](1_week#embedded-software-engineering)
  * [C-Programming Review](1_week#c-programming-review)
* [**Week 2: Compilation with GCC and GNU Make**](2_week)
  * [Introduction to Build Systems using GNU Toolsets](2_week#introduction-to-build-systems-using-gnu-toolsets)
  * [Compiling and Invoking GCC](2_week#compiling-and-invoking-gcc)
  * [Preprocessor Directives](2_week#preprocessor-directives)
  * [Creating Header and Implementation Files](2_week#creating-header-and-implementation-files)
  * [Linkers](2_week#linkers)
  * [Make](2_week#make)
  * [Makefiles](2_week#makefiles)
  * [Other Useful GNU Bin Tools](2_week#other-useful-gnu-bin-tools)
* [**Week 3: Memory Types, Segments and Management**](3_week)
	* [Introduction to Memory Organization](3_week#introduction-to-memory-organization)
	* [Memory Architectures](3_week#memory-architectures)
	* [Memory Segments](3_week#memory-segments)
	* [Data Memory](3_week#data-memory)
	* [Special Keywords](3_week#special-keywords)
	* [The Stack](3_week#the-stack)
	* [The Heap](3_week#the-heap)
	* [Code Memory](3_week#code-memory)

---
## Resources
* [Makefile Tutorial](https://gist.github.com/isaacs/62a2d1825d04437c6f08)
* [Friendly ARM](https://www.friendlyarm.com/)
  * [NanoPi NEO2](http://www.nanopi.org/NanoPi-NEO2_Feature.html)

---
## Assignments
### Week 1: Statistical Analytics
```c
  #include <limits.h>
  #include <stdlib.h>
  #include <stdio.h>
  #include "stats.h"

  const int INF = INT_MAX;

  void print_statistics( HType A, size_t N ){
      printf( "sorted: " );
      sort_array( A, N, compare );
      print_array( A, N );
      Type min = find_minimum( A, N ),
           max = find_maximum( A, N );
      double median = find_median( A, N ),
             mean   = find_mean( A, N );
      printf( "min:    %d\n", min );
      printf( "max:    %d\n", max );
      printf( "median: %.1lf\n", median );
      printf( "mean:   %.1lf\n", mean );
  }

  void print_array( HType A, size_t N ){
      if( ! A )
          return;
      for( int i=0; i < N; printf( "%d ", A[ i++ ] ) );
      printf( "\n" );
  }

  double find_median( HType A, size_t N ){
      if( ! A )
          return 0;
      sort_array( A, N, compare );
      return( N%2 )? A[ N/2 ] : ( A[ (N-1)/2 ] + A[ N/2 ] ) / 2;
  }

  double find_mean( HType A, size_t N ){
      if( ! A )
          return 0;
      int sum = 0;
      for( int i=0; i < N; sum += A[ i++ ] );
      return sum / N;
  }

  Type find_maximum( HType A, size_t N ){
      if( ! A )
          return 0;
      int max = -INF;
      for( int i=0; i < N; ++i )
          if( max < A[ i ] )
              max = A[ i ];
      return max;
  }

  Type find_minimum( HType A, size_t N ){
      if( ! A )
          return 0;
      int min = INF;
      for( int i=0; i < N; ++i )
          if( min > A[ i ] )
              min = A[ i ];
      return min;
  }

  int compare( const void* lhs, const void* rhs ){
      if( ! lhs || ! rhs )
          return 0;
      HType first  = ( HType ) lhs,
            second = ( HType ) rhs;
      Type a = *first,
           b = *second;
      return( a < b )? -1
          : ( a > b )?  1
          :             0;
  }

  void sort_array( HType A, size_t N, int ( * cmp )( const void*, const void* ) ){
      if( ! A )
          return;
      qsort( A, N, sizeof( Type ), cmp );
  }
```

---
### Week 2: Cross-Compilation with GCC and GNU Make

#### sources.mk

```makefile
  SOURCES =  \
    main.c   \
    memory.c

  SOURCES_MSP432 =               \
    interrupts_msp432p401r_gcc.c \
    startup_msp432p401r_gcc.c    \
    system_msp432p401r.c

  INCLUDE_DIRS =        \
    -I../include/common \
    -I../include/msp432 \
    -I../include/CMSIS
```

#### Makefile

```makefile
  #------------------------------------------------------------------------------
  # Makefile for HOST and MSP432 platforms
  #
  # Use: make [TARGET] [PLATFORM-OVERRIDES]
  #
  # Build Targets:
  #      %.i
  #      %.asm
  #      %.o
  #      compile-all
  #      build
  #      clean
  #      print-VARIABLE
  #
  # Platform Overrides:
  #      HOST
  #      MSP432
  #
  #------------------------------------------------------------------------------

  include sources.mk

  PLATFORM = HOST
  OBJECTS = $(SOURCES:.c=.o)
  TARGET = c1m2.out
  CFLAGS = -Wall -Werror -O0 -std=c99 $(FLAGS)
  DEPFLAGS = -MT $@ -MMD -MP -MF $*.dep

  ifeq ($(PLATFORM), HOST)
    CC = gcc
    SIZE = size
    SIZE_FLAGS = -l -m -x
  endif
  ifeq ($(PLATFORM), MSP432)
    TOOLCHAIN_DIR = /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin
    CC = $(TOOLCHAIN_DIR)/arm-none-eabi-gcc
    SIZE = $(TOOLCHAIN_DIR)/arm-none-eabi-size
    SIZE_FLAGS = -A -x
    ARCH = armv7e-m
    CPU = cortex-m4
    SPECS = nosys.specs
    LINKER_FILE = msp432p401r.lds
    LDFLAGS = -Wl,-Map=c1m2.map
    PLATFORM_FLAGS = -march=$(ARCH) -mcpu=$(CPU) --specs=$(SPECS) -T $(LINKER_FILE)
    OBJECTS := $(OBJECTS) $(SOURCES_MSP432:.c=.o)
  endif

  $(TARGET): $(OBJECTS)
    $(CC) -o $@ $^ -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(LDFLAGS) $(PLATFORM_FLAGS)
    $(SIZE) $(SIZE_FLAGS) $@

  %.o: %.c
    $(CC) -o $@ -c $< -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(PLATFORM_FLAGS)

  %.asm: %.c
    $(CC) -o $@ -S $< -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(PLATFORM_FLAGS)

  %.i: %.c
    $(CC) -o $@ -E $< -D$(PLATFORM) $(INCLUDE_DIRS) $(CFLAGS) $(DEPFLAGS) $(PLATFORM_FLAGS)

  .PHONY: clean
  clean:
    -@rm *.asm *.dep *.i *.map *.o *.out 2> /dev/null || true

  .PHONY: build
  build: $(TARGET)

  .PHONY: compile-all
  compile-all: $(OBJECTS)

  print-% :
    @echo $* = $($*)

```

#### Example Output
```shell
   $ make clean
   $ make TARGET=c1m2.out PLATFORM=HOST
   gcc -o main.o -c main.c -DHOST -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS
   gcc -o memory.o -c memory.c -DHOST -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS
   gcc -o c1m2.out main.o memory.o -DHOST -Wall -Werror -O0 -std=c99  -I../include/common -I../include/msp432 -I../include/CMSIS
   size -l -m -x c1m2.out
   Segment __PAGEZERO: 0x100000000 (vmaddr 0x0 fileoff 0)
   Segment __TEXT: 0x1000 (vmaddr 0x100000000 fileoff 0)
     Section __text: 0x275 (addr 0x100000d10 offset 3344)
     Section __stubs: 0x6 (addr 0x100000f86 offset 3974)
     Section __stub_helper: 0x1a (addr 0x100000f8c offset 3980)
     Section __cstring: 0x5 (addr 0x100000fa6 offset 4006)
     Section __unwind_info: 0x48 (addr 0x100000fac offset 4012)
     total 0x2e2
   Segment __DATA: 0x1000 (vmaddr 0x100001000 fileoff 4096)
     Section __nl_symbol_ptr: 0x10 (addr 0x100001000 offset 4096)
     Section __la_symbol_ptr: 0x8 (addr 0x100001010 offset 4112)
     Section __common: 0xa (addr 0x100001020 offset 0)
     total 0x22
   Segment __LINKEDIT: 0x1000 (vmaddr 0x100002000 fileoff 8192)
   total 0x100003000
  
   $ ./c1m2.out
   aXy72_L+R
  
   $ make clean
   $ make TARGET=c1m2.out PLATFORM=MSP432
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o main.o -c main.c -DMSP432 -I../include/common -I../include/msp432 -I../include/CMSIS -Wall -Werror -O0 -std=c99  -MT main.o -MMD -MP -MF main.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o memory.o -c memory.c -DMSP432 -I../include/common -I../include/msp432 -I../include/CMSIS -Wall -Werror -O0 -std=c99  -MT memory.o -MMD -MP -MF memory.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o interrupts_msp432p401r_gcc.o -c interrupts_msp432p401r_gcc.c -DMSP432 -I../include/common -I../include/msp432 -I../include/CMSIS -Wall -Werror -O0 -std=c99  -MT interrupts_msp432p401r_gcc.o -MMD -MP -MF interrupts_msp432p401r_gcc.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o startup_msp432p401r_gcc.o -c startup_msp432p401r_gcc.c -DMSP432 -I../include/common -I../include/msp432 -I../include/CMSIS -Wall -Werror -O0 -std=c99  -MT startup_msp432p401r_gcc.o -MMD -MP -MF startup_msp432p401r_gcc.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o system_msp432p401r.o -c system_msp432p401r.c -DMSP432 -I../include/common -I../include/msp432 -I../include/CMSIS -Wall -Werror -O0 -std=c99  -MT system_msp432p401r.o -MMD -MP -MF system_msp432p401r.dep -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-gcc -o c1m2.out main.o memory.o interrupts_msp432p401r_gcc.o startup_msp432p401r_gcc.o system_msp432p401r.o -DMSP432 -I../include/common -I../include/msp432 -I../include/CMSIS -Wall -Werror -O0 -std=c99  -MT c1m2.out -MMD -MP -MF c1m2.dep -Wl,-Map=c1m2.map -march=armv7e-m -mcpu=cortex-m4 --specs=nosys.specs -T msp432p401r.lds
   /opt/toolchains/gcc-arm-none-eabi-8-2018-q4-major/bin/arm-none-eabi-size -A -x c1m2.out
   c1m2.out  :
   section                     size         addr
   .intvecs                   0x140          0x0
   .text                      0xd70        0x140
   .text:Reset_Handler         0x6c        0xeb0
   .text:NMI_Handler            0xe        0xf1c
   .text:HardFault_Handler      0xe        0xf2a
   .text:Default_Handler        0xe        0xf38
   .rodata                      0x4        0xf48
   .eh_frame                    0x4        0xf4c
   .ARM.exidx                   0x8        0xf50
   .data                      0x43c   0x20000000
   .bss                        0x4c   0x2000043c
   .ARM.attributes             0x2a          0x0
   .comment                    0x75          0x0
   .debug_frame               0x2e4          0x0
   Total                     0x1761
```

---
### Week 3: Memory Analysis

Based on the code and the linker file, specify the following details for the segment, sub-segment, permissions, and lifetime for each of the following symbols:

#### g1



